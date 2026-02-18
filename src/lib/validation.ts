import { z } from 'zod';
import { VALIDATION_MESSAGES } from './validation-messages';

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.email.required)
  .email(VALIDATION_MESSAGES.email.invalid)
  .toLowerCase()
  .trim();

export const phoneSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.phone.required)
  .regex(/^(\+44|0)?[1-9]\d{9,10}$/, VALIDATION_MESSAGES.phone.invalid);

export const nameSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.name.required)
  .min(2, VALIDATION_MESSAGES.name.minLength)
  .max(50, VALIDATION_MESSAGES.name.maxLength)
  .trim();

export const messageSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.message.required)
  .min(10, VALIDATION_MESSAGES.message.minLength)
  .max(1000, VALIDATION_MESSAGES.message.maxLength)
  .trim();

// Newsletter form schema
export const newsletterSchema = z.object({
  email: emailSchema,
});

// Contact form schema (for future use)
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  pubName: z.string().min(1, VALIDATION_MESSAGES.pubName.required).trim(),
  message: messageSchema,
});

// Type exports
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;

// Validation helper
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { form: VALIDATION_MESSAGES.generic.validationFailed } };
  }
}

// Sanitization helpers
export function sanitizeInput(input: string): string {
  // Remove any HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, '');
  // Remove any script tags content
  const withoutScripts = withoutTags.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  );
  // Trim whitespace
  return withoutScripts.trim();
}

// XSS prevention for display
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
