'use client';

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
// Fallback: no toast hook available in ui; use window alert for now
const toast = ({ title, description }: { title: string; description?: string }) => {
  if (typeof window !== 'undefined') {
    alert(`${title}${description ? `\n\n${description}` : ''}`);
  }
};
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
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  function onSubmit(data: ContactFormValues) {
    toast({
      title: 'Form submitted',
      description: JSON.stringify(data, null, 2),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <FormLabel>Phone</FormLabel>
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
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
