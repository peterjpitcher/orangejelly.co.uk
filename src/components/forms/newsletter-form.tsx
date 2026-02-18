'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// Fallback: simple alert-based toast replacement
const toast = ({ title, description }: { title: string; description?: string }) => {
  if (typeof window !== 'undefined') {
    alert(`${title}${description ? `\n\n${description}` : ''}`);
  }
};
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
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues,
  });

  function onSubmit(data: NewsletterFormValues) {
    toast({
      title: 'Subscribed',
      description: JSON.stringify(data, null, 2),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={PLACEHOLDERS.email.default} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </Form>
  );
}
