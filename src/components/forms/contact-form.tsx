'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { VALIDATION_MESSAGES, PLACEHOLDERS } from '@/lib/validation-messages';

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: VALIDATION_MESSAGES.name.minLength,
  }),
  email: z.string().email({
    message: VALIDATION_MESSAGES.email.invalid,
  }),
  phone: z.string().optional(),
  pubName: z.string().min(2, {
    message: VALIDATION_MESSAGES.pubName.minLength,
  }),
  message: z.string().min(10, {
    message: VALIDATION_MESSAGES.message.minLength,
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const defaultValues: Partial<ContactFormValues> = {
  name: '',
  email: '',
  phone: '',
  pubName: '',
  message: '',
};

export function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  function onSubmit(data: ContactFormValues) {
    // In real implementation, this would call your contact API
    console.log('Contact form submission:', data);
    setSubmitStatus('success');
    form.reset();
  }

  if (submitStatus === 'success') {
    return (
      <div
        className="rounded-lg bg-green-50 border border-green-200 p-6 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-green-800 font-semibold text-lg mb-2">Message sent successfully</p>
        <p className="text-green-700 text-sm">
          Thanks for getting in touch. Peter will reply as soon as possible.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => setSubmitStatus('idle')}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" aria-label="Contact form">
        {submitStatus === 'error' && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4" role="alert">
            <p className="text-red-800 text-sm">
              Something went wrong. Please try again or message Peter on WhatsApp instead.
            </p>
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder={PLACEHOLDERS.name.default} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder={PLACEHOLDERS.email.default} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (optional)</FormLabel>
              <FormControl>
                <Input placeholder={PLACEHOLDERS.phone.optional} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pubName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Name</FormLabel>
              <FormControl>
                <Input placeholder={PLACEHOLDERS.pubName.default} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={PLACEHOLDERS.message.default}
                  className="resize-none min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto min-h-[44px]">
          Send Message
        </Button>
      </form>
    </Form>
  );
}
