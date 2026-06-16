'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VALIDATION_MESSAGES, PLACEHOLDERS } from '@/lib/validation-messages';
import { submitContactForm } from '@/app/actions/contact';
import { getBrowserLeadSource } from '@/lib/lead-source';

const PACKAGE_OPTIONS = [
  { value: 'none', label: 'Not sure yet' },
  { value: 'growth-fix', label: 'Growth Fix (from £375 + VAT)' },
  { value: 'momentum-month', label: 'Momentum Month (£900/mo + VAT)' },
  { value: 'growth-partner', label: 'Growth Partner (£1,800/mo + VAT)' },
  { value: 'turnaround-intensive', label: 'Turnaround Intensive (POA)' },
] as const;

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
  package: z.string().optional(),
  message: z.string().min(10, {
    message: VALIDATION_MESSAGES.message.minLength,
  }),
  website: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const searchParams = useSearchParams();
  const preselectedPackage = searchParams.get('package') || 'none';
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle'
  );

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      pubName: '',
      package: preselectedPackage,
      message: '',
      website: '',
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setSubmitStatus('submitting');
    try {
      const result = await submitContactForm({
        ...data,
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
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
          {...form.register('website')}
        />
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
          name="package"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interested in a package?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || 'none'}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PACKAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <Button
          type="submit"
          className="w-full sm:w-auto min-h-[44px]"
          disabled={submitStatus === 'submitting'}
        >
          {submitStatus === 'submitting' ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  );
}
