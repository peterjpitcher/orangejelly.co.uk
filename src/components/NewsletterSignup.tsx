'use client';

import { useState } from 'react';
import FormButton from '@/components/forms/FormButton';
import Input from '@/components/forms/Input';
import Text from '@/components/Text';
import Heading from '@/components/Heading';
import { emailSchema } from '@/lib/validation';
import { useFormValidation } from '@/hooks/useFormValidation';
import { PLACEHOLDERS, SUCCESS_MESSAGES, FORM_DESCRIPTIONS } from '@/lib/validation-messages';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  buttonText?: string;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
  onSuccess?: () => void;
}

export default function NewsletterSignup({
  title = FORM_DESCRIPTIONS.newsletter.title,
  description = FORM_DESCRIPTIONS.newsletter.description,
  buttonText = 'Subscribe',
  variant = 'default',
  className = '',
  onSuccess,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const { errors, isSubmitting, validateField, handleSubmit, clearErrors } = useFormValidation({
    schema: emailSchema,
    onSubmit: async (data) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real implementation, this would call your newsletter API
      console.log('Newsletter signup:', data);

      setSuccess(true);
      setEmail('');
      clearErrors();

      if (onSuccess) {
        onSuccess();
      }

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(email);
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleFormSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder={PLACEHOLDERS.email.simple}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateField('email', e.target.value);
          }}
          error={errors.email}
          className="flex-1"
          aria-label="Email address"
          required
        />
        <FormButton
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting || !email}
        >
          {buttonText}
        </FormButton>
      </form>
    );
  }

  return (
    <div className={className}>
      {variant === 'default' && (
        <>
          <Heading level={3} className="mb-3">
            {title}
          </Heading>
          <Text className="mb-6" color="muted">
            {description}
          </Text>
        </>
      )}

      {success ? (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg">
          <Text weight="semibold">{SUCCESS_MESSAGES.newsletter.subscribed}</Text>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            type="email"
            label={variant === 'compact' ? undefined : 'Email Address'}
            placeholder={PLACEHOLDERS.email.newsletter}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField('email', e.target.value);
            }}
            error={errors.email || errors.form}
            required
          />

          <FormButton
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? SUCCESS_MESSAGES.newsletter.subscribing : buttonText}
          </FormButton>

          <Text size="xs" color="muted" className="text-center">
            {FORM_DESCRIPTIONS.newsletter.disclaimer}
          </Text>
        </form>
      )}
    </div>
  );
}
