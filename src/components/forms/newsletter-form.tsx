'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VALIDATION_MESSAGES, PLACEHOLDERS } from '@/lib/validation-messages';

const newsletterFormSchema = z.object({
  email: z.string().email({
    message: VALIDATION_MESSAGES.email.invalid,
  }),
});

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

const defaultValues: Partial<NewsletterFormValues> = {
  email: '',
};

export function NewsletterForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues,
  });

  function onSubmit(data: NewsletterFormValues) {
    // In real implementation, this would call your newsletter API
    console.log('Newsletter signup:', data);
    setSubmitStatus('success');
    form.reset();
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
        <Button type="submit" className="min-h-[44px]">
          Subscribe
        </Button>
      </form>
    </Form>
  );
}
