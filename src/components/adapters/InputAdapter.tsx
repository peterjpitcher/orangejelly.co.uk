import * as React from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface LegacyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
}

export default function InputAdapter({
  label,
  error,
  helperText,
  variant = 'default',
  className,
  id,
  ...props
}: LegacyInputProps) {
  // Generate an ID if not provided
  const generatedId = React.useId();
  const inputId = id || generatedId;

  const inputClasses = cn(
    error && 'border-destructive focus-visible:ring-destructive',
    variant === 'filled' && 'bg-muted',
    variant === 'outlined' && 'border-2',
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={inputId} className={cn(error && 'text-destructive')}>
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <ShadcnInput
        id={inputId}
        className={inputClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />

      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
