import { describe, expect, it } from 'vitest';

import { definitionToSurvey, surveyDefinitionSchema } from './definition';
import { validateAnswers } from './logic';
import { surveyResponseEmail } from './notification';
import pubApps from '../../../content/surveys/pub-apps.json';

/**
 * Rendered with the real pub apps survey and fixture answers, and checked for
 * the values that have reached real inboxes before.
 */

const survey = definitionToSurvey(surveyDefinitionSchema.parse(pubApps));

function answersFor(raw: Record<string, unknown>) {
  const result = validateAnswers(survey, raw);
  if (!result.ok) throw new Error(`fixture answers invalid: ${JSON.stringify(result.errors)}`);
  return result.answers;
}

const FULL = answersFor({
  front: ['tables', 'events'],
  back: ['rotas'],
  top_pick: ['events'],
  price: ['price_10_30'],
  pay_model: ['pay_per_tool'],
  must_do: 'Take deposits <without> me chasing & people.\nAnd reminders.',
  missing: '',
  venue: ['venue_local'],
  run: ['run_tenant'],
  say: ['say_call'],
  test: ['test_early'],
});

const BROKEN = /undefined|NaN|Invalid Date|\bnull\b|\[object Object\]/;

describe('surveyResponseEmail', () => {
  it('lists every answer by its label, in survey order, with the running count', () => {
    const email = surveyResponseEmail({
      survey,
      answers: FULL,
      source: 'facebook',
      isPreview: false,
      responses: 12,
    });

    expect(email.subject).toBe('Survey response: Which tools would make running your pub easier?');
    expect(email.replyTo).toBeUndefined();
    expect(email.text).toContain(
      'Customers and bookings: which of these would you use?\n  Table bookings, Event bookings'
    );
    expect(email.text).toContain(
      'Your top pick: Event bookings. What would it be worth to you each month?\n  £10 to £30'
    );
    expect(email.text).toContain('How do you run it?\n  Tenant or leaseholder');
    expect(email.text).toContain('Came from: facebook');
    expect(email.text).toContain('Real responses so far: 12');
    expect(email.text.indexOf('Customers and bookings')).toBeLessThan(
      email.text.indexOf('How do you run it?')
    );
    expect(`${email.subject}${email.html}${email.text}`).not.toMatch(BROKEN);
  });

  it('leads with the volunteer, replies to them, and names them in the subject', () => {
    const email = surveyResponseEmail({
      survey,
      answers: FULL,
      contact: {
        name: 'Sam Whitfield',
        email: 'sam@testarms.example',
        businessName: 'The Test Arms',
        volunteeredFor: ['say_call', 'test_early'],
      },
      isPreview: false,
      responses: 3,
    });

    expect(email.subject).toBe('Survey volunteer: The Test Arms');
    expect(email.replyTo).toBe('sam@testarms.example');
    expect(email.text).toMatch(
      /VOLUNTEER\nName: Sam Whitfield\nBusiness: The Test Arms\nEmail: sam@testarms\.example\nSaid yes to: Yes, I'd happily have a short call; Yes, I'd test it early/
    );
    expect(email.text).toContain('Came from: direct');
    expect(`${email.subject}${email.html}${email.text}`).not.toMatch(BROKEN);
  });

  it('marks a preview answer and does not pretend it was counted', () => {
    const email = surveyResponseEmail({ survey, answers: FULL, isPreview: true, responses: 0 });
    expect(email.subject).toMatch(/^\[Preview\] Survey response: /);
    expect(email.text).toContain(
      'This was a preview answer. It is stored apart and never counted.'
    );
    expect(email.text).not.toContain('Real responses so far');
  });

  it('escapes what respondents type, so an answer cannot inject HTML into the email', () => {
    const email = surveyResponseEmail({ survey, answers: FULL, isPreview: false, responses: 1 });
    expect(email.html).toContain(
      'Take deposits &lt;without&gt; me chasing &amp; people.<br>And reminders.'
    );
    expect(email.html).not.toContain('<without>');
  });

  it('says so when the count could not be read, rather than printing nothing', () => {
    const email = surveyResponseEmail({
      survey,
      answers: answersFor({
        front: [],
        back: [],
        venue: ['venue_food'],
        run: ['run_other'],
        say: ['say_no'],
        test: ['test_no'],
      }),
      isPreview: false,
      responses: null,
    });
    expect(email.text).toContain('The running count could not be read just now');
    expect(email.text).not.toContain('Your top pick');
    expect(`${email.subject}${email.html}${email.text}`).not.toMatch(BROKEN);
  });
});
