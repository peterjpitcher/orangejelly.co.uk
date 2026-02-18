import * as React from 'react';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface LegacyTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
}

export default function TextareaAdapter({
  label,
  error,
  helperText,
  variant = 'default',
  className,
  id,
  ...props
}: LegacyTextareaProps) {
  // Generate an ID if not provided
  const generatedId = React.useId();
  const textareaId = id || generatedId;

  const textareaClasses = cn(
    error && 'border-destructive focus-visible:ring-destructive',
    variant === 'filled' && 'bg-muted',
    variant === 'outlined' && 'border-2',
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={textareaId} className={cn(error && 'text-destructive')}>
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <ShadcnTextarea
        id={textareaId}
        className={textareaClasses}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
        }
        {...props}
      />

      {helperText && !error && (
        <p id={`${textareaId}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}

      {error && (
        <p id={`${textareaId}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
