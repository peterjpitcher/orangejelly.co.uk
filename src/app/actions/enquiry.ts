'use server';

import { headers } from 'next/headers';

/*
 * The form state type and its initial value live in a plain module, not here.
 *
 * A 'use server' file may only export async functions. Exporting a plain object from
 * one makes the whole action module fail to load, and the failure only appears when a
 * person presses the button: the build exits 0, tsc exits 0, lint passes and 1,613
 * tests pass, because none of them enforce the rule. It cost this site every enquiry
 * until a pre-flight check pressed the button on a real build.
 *
 * A type-only re-export is fine, because types are erased before any of this runs.
 */
import type { EnquiryFormState } from '@/lib/schemas/enquiry';

export type { EnquiryFormState };

import { storeEnquiryStep1, storeEnquiryStep2 } from '@/lib/db/enquiries';
import { storeConversionEvent } from '@/lib/db/leads';
import { sendLeadNotification, escapeHtml } from '@/lib/email';
import { type LeadSourceInput } from '@/lib/lead-source';
import { cleanEnquirySource } from '@/lib/enquiry-source';
import {
  RATE_LIMIT_MESSAGE,
  checkRateLimit,
  getClientIp,
  hashKey,
  isRateLimitConfigured,
} from '@/lib/rate-limit';
import {
  countCompletedFields,
  enquiryStep1Schema,
  enquiryStep2Schema,
} from '@/lib/schemas/enquiry';

/**
 * The enquiry server actions.
 *
 * @see tasks/repositioning/SUB-SPECS.md part 1
 */

export interface EnquiryStep1Result {
  success?: true;
  leadId?: string;
  error?: string;
  /** Field-level errors, keyed by field name, for the form to render inline. */
  fieldErrors?: Record<string, string>;
}

/**
 * Notification carries step one only.
 *
 * The qualification answers are the commercially sensitive half and they stay
 * behind admin auth rather than sitting in an inbox indefinitely. The email says
 * enough to reply to a person, and links to the rest.
 */
const ADMIN_URL = 'https://www.orangejelly.co.uk/admin';

function notificationBody(input: {
  name: string;
  email: string;
  company: string;
  situation: string;
  sourcePage?: string;
}): { html: string; text: string } {
  const rows: Array<[string, string]> = [
    ['Name', input.name],
    ['Company', input.company],
    ['Email', input.email],
    ['What is happening', input.situation],
  ];
  if (input.sourcePage) rows.push(['Came from', input.sourcePage]);

  // The qualification answers are not in this list and never will be. They stay
  // behind admin auth rather than sitting in an inbox indefinitely, so the mail
  // links to them instead of carrying them.
  const tail = 'The rest of the answers, and the lead state, are in the admin view.';

  return {
    html: [
      ...rows.map(
        ([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
      ),
      `<p>${escapeHtml(tail)}</p>`,
      `<p><a href="${ADMIN_URL}">${ADMIN_URL}</a></p>`,
    ].join('\n'),
    text: [...rows.map(([label, value]) => `${label}: ${value}`), '', tail, ADMIN_URL].join('\n'),
  };
}

export async function submitEnquiryStep1(input: unknown): Promise<EnquiryStep1Result> {
  const parsed = enquiryStep1Schema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? '');
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { error: 'Please check the highlighted fields.', fieldErrors };
  }

  const data = parsed.data;

  // Honeypot. A real person never sees this field, so anything in it is a bot.
  // Answer as though it worked: telling a bot it failed only teaches it.
  if (data.subject) {
    return { success: true };
  }

  const source = cleanEnquirySource((input as { leadSource?: unknown })?.leadSource);

  // FAIL CLOSED. This action sends mail and writes personal data, so an
  // unavailable limiter must not degrade to unlimited. That is the opposite of the
  // poll actions, which fail open because being unable to vote is worse than being
  // rate limited.
  if (isRateLimitConfigured()) {
    const ip = getClientIp(headers());
    const byIp = await checkRateLimit('enquiry_ip', hashKey(ip));
    if (!byIp.allowed) return { error: RATE_LIMIT_MESSAGE };

    const byEmail = await checkRateLimit('enquiry_email', hashKey(data.email.toLowerCase()));
    if (!byEmail.allowed) return { error: RATE_LIMIT_MESSAGE };
  }

  // The row is the authoritative success condition. Nothing below this line may
  // turn a stored enquiry into a user-facing error.
  const stored = await storeEnquiryStep1(data, source);
  if (!stored.stored || !stored.id) {
    return { error: 'Something went wrong. Please email peter@orangejelly.co.uk directly.' };
  }

  /*
   * Awaited, not fired and forgotten.
   *
   * This was `void afterEnquiryStored(...)`, on the sound reasoning that a failed
   * notification must never tell somebody their enquiry did not arrive. That reasoning
   * still holds and it is already satisfied a different way: every step inside
   * afterEnquiryStored catches its own errors, so awaiting it cannot surface one.
   *
   * What not awaiting costs is the email itself. On Vercel the function can be frozen
   * the moment the response is sent, so the notification may never be attempted, and
   * the console.error that would have recorded the failure never runs either. The
   * enquiry is safe in the database, but nobody is told it arrived, intermittently, so
   * it works in testing and fails in production.
   *
   * There is no deferral primitive available here to do it properly: Next is 14.2.35,
   * which has no `after`, and @vercel/functions is not a dependency. So it is awaited.
   * That costs 200 to 400ms on a form a person submits once.
   */
  await afterEnquiryStored(stored.id, data, source);

  return { success: true, leadId: stored.id };
}

/**
 * Retryable secondary work.
 *
 * Every step in here catches its own errors, so a failed notification is logged as the
 * operational problem it is and never becomes a reason to tell somebody their enquiry
 * did not arrive. That containment is what makes it safe for the caller to await this.
 */
async function afterEnquiryStored(
  leadId: string,
  data: { name: string; email: string; company: string; situation: string },
  source?: LeadSourceInput
): Promise<void> {
  try {
    const conversion = await storeConversionEvent({
      eventName: 'enquiry_submitted',
      ownerType: 'contact',
      ownerId: leadId,
      email: data.email,
      leadSource: source,
      properties: { source_page: source?.sourcePage ?? null },
    });
    if (!conversion.stored)
      console.error('[enquiry] stored, but the conversion event was not recorded.');
  } catch (error) {
    console.error('[enquiry] stored, but the conversion event failed:', error);
  }

  try {
    const body = notificationBody({ ...data, sourcePage: source?.sourcePage });
    const notification = await sendLeadNotification({
      subject: `New enquiry: ${data.company.replace(/[\r\n]+/g, ' ').trim()}`,
      html: body.html,
      text: body.text,
      replyTo: data.email,
    });
    if (notification.error) {
      console.error('[enquiry] stored, but the notification was not sent:', notification.error);
    }
  } catch (error) {
    console.error('[enquiry] stored, but the notification threw:', error);
  }
}

export interface EnquiryStep2Result {
  success?: true;
  error?: string;
}

export async function submitEnquiryStep2(
  leadId: string,
  input: unknown
): Promise<EnquiryStep2Result> {
  if (!leadId) return { error: 'Missing enquiry reference.' };

  const parsed = enquiryStep2Schema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Please check the highlighted fields.' };
  }

  const stored = await storeEnquiryStep2(leadId, parsed.data);
  if (!stored.stored) {
    // Step two is a bonus. The enquiry is already safe, so a failure here is logged
    // and swallowed rather than shown: there is nothing useful for the person to do
    // about it, and telling them implies their enquiry is at risk when it is not.
    console.error('[enquiry] step two did not store:', stored.error);
    return { success: true };
  }

  try {
    await storeConversionEvent({
      eventName: 'enquiry_qualified',
      ownerType: 'contact',
      ownerId: leadId,
      properties: { fields_completed: countCompletedFields(parsed.data) },
    });
  } catch (error) {
    console.error('[enquiry] qualified, but the conversion event failed:', error);
  }

  return { success: true };
}

/**
 * FORM-DATA ENTRY POINT
 *
 * One action drives both steps, so the whole enquiry is a single `<form>` whose
 * action is a server action. That is what makes it work without JavaScript: the
 * browser posts the form, the action runs, and Next re-renders the page with the
 * returned state. With JavaScript it is the same code path without the navigation.
 *
 * Which step runs is decided by the state the form carries, not by anything the
 * client asserts, and step two additionally requires a lead id that only step one
 * can have produced.
 */

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function leadSourceFrom(formData: FormData): LeadSourceInput {
  const raw = text(formData, 'leadSource');
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as LeadSourceInput) : {};
  } catch {
    // A malformed hidden field is an attribution problem, never a reason to lose
    // the enquiry.
    return {};
  }
}

export async function submitEnquiry(
  previous: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  /*
   * One step, as of 31 August 2026, on the owner's instruction.
   *
   * There was a second screen of six optional qualifying questions between the
   * enquiry and the thank-you. It was described as optional and had a skip button,
   * and it still sat between somebody who had just decided to make contact and any
   * confirmation that they had. The enquiry is complete when the lead is stored, so
   * that is where it now ends.
   *
   * `submitEnquiryStep2` is left in place and still exported: the six columns exist
   * in the database, the admin dashboard reads them, and the rows written before
   * today still carry answers. Deleting the writer would make that data unreachable
   * to no purpose. Nothing calls it from the form any more.
   */
  const values = {
    name: text(formData, 'name'),
    email: text(formData, 'email'),
    company: text(formData, 'company'),
    situation: text(formData, 'situation'),
  };

  const result = await submitEnquiryStep1({
    ...values,
    subject: text(formData, 'subject'),
    leadSource: leadSourceFrom(formData),
  });

  if (result.error) {
    return { step: 1, error: result.error, fieldErrors: result.fieldErrors, values };
  }

  // A honeypot submission returns success with no lead id. It goes straight to the
  // thank-you, because sending a bot on to step two only wastes another write.
  if (!result.leadId) {
    return { step: 'done' };
  }

  return { step: 'done', leadId: result.leadId };
}
