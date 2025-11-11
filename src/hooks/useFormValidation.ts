'use client';

import { useState, useCallback } from 'react';
import { z } from 'zod';
import { validateForm } from '@/lib/validation';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => void | Promise<void>;
}

export function useFormValidation<T>({ schema, onSubmit }: UseFormValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: string, value: unknown) => {
      try {
        const fieldSchema =
          schema instanceof z.ZodObject
            ? schema.shape[name as keyof typeof schema.shape]
            : undefined;
        if (fieldSchema) {
          fieldSchema.parse(value);
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors((prev) => ({
            ...prev,
            [name]: error.issues[0]?.message || 'Invalid value',
          }));
        }
      }
    },
    [schema]
  );

  const handleSubmit = useCallback(
    async (formData: unknown) => {
      setIsSubmitting(true);
      setErrors({});

      const validation = validateForm(schema, formData);

      if (validation.success) {
        try {
          await onSubmit(validation.data);
        } catch {
          setErrors({ form: 'Something went wrong. Please try again.' });
        }
      } else {
        setErrors(validation.errors);
      }

      setIsSubmitting(false);
    },
    [schema, onSubmit]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    isSubmitting,
    validateField,
    handleSubmit,
    clearErrors,
  };
}
