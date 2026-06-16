'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VALIDATION_MESSAGES, PLACEHOLDERS } from '@/lib/validation-messages';
import { subscribeToNewsletter } from '@/app/actions/newsletter';
import { getBrowserLeadSource } from '@/lib/lead-source';

const newsletterFormSchema = z.object({
  email: z.string().email({
    message: VALIDATION_MESSAGES.email.invalid,
  }),
  website: z.string().optional(),
});

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

const defaultValues: Partial<NewsletterFormValues> = {
  email: '',
  website: '',
};

export function NewsletterForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues,
  });

  async function onSubmit(data: NewsletterFormValues) {
    setSubmitStatus('submitting');
    try {
      const result = await subscribeToNewsletter({
        email: data.email,
        website: data.website,
        leadSource: getBrowserLeadSource(),
      });
      if (result.error) {
        setSubmitStatus('error');
        return;
      }
      setSubmitStatus('success');
      form.reset();
    } catch {
      setSubmitStatus('error');
    }
  }

  if (submitStatus === 'success') {
    return (
      <div
        className="rounded-lg bg-green-50 border border-green-200 p-4"
        role="status"
        aria-live="polite"
      >
        <p className="text-green-800 font-semibold text-sm">
          You're subscribed. Watch your inbox for practical hospitality tips.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label="Newsletter signup"
      >
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
          {...form.register('website')}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={PLACEHOLDERS.email.default}
                  {...field}
                  className="min-h-[44px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitStatus === 'error' && (
          <p className="text-red-800 text-sm" role="alert">
            Something went wrong. Please try again later.
          </p>
        )}
        <Button type="submit" className="min-h-[44px]" disabled={submitStatus === 'submitting'}>
          {submitStatus === 'submitting' ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </Form>
  );
}
