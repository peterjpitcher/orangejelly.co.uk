import * as React from 'react';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface LegacyCheckboxProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  id?: string;
  name?: string;
  value?: string;
}

export default function CheckboxAdapter({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  required,
  error,
  helperText,
  className,
  id,
  name,
  value,
}: LegacyCheckboxProps) {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <ShadcnCheckbox
          id={checkboxId}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={cn(error && 'border-destructive', className)}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${checkboxId}-error` : helperText ? `${checkboxId}-helper` : undefined
          }
          name={name}
          value={value}
        />
        {label && (
          <Label
            htmlFor={checkboxId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              error && 'text-destructive'
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
      </div>

      {helperText && !error && (
        <p id={`${checkboxId}-helper`} className="text-sm text-muted-foreground ml-6">
          {helperText}
        </p>
      )}

      {error && (
        <p id={`${checkboxId}-error`} className="text-sm text-destructive ml-6" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Checkbox group component for multiple checkboxes
interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  label?: string;
  options: CheckboxOption[];
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export function CheckboxGroup({
  label,
  options,
  values: controlledValues,
  defaultValues,
  onValuesChange,
  error,
  helperText,
  required,
  className,
}: CheckboxGroupProps) {
  const [values, setValues] = React.useState<string[]>(defaultValues || []);
  const activeValues = controlledValues !== undefined ? controlledValues : values;

  const handleCheckChange = (value: string, checked: boolean) => {
    const newValues = checked ? [...activeValues, value] : activeValues.filter((v) => v !== value);

    if (controlledValues === undefined) {
      setValues(newValues);
    }
    onValuesChange?.(newValues);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <Label className={cn(error && 'text-destructive')}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <div className="space-y-2">
        {options.map((option) => (
          <CheckboxAdapter
            key={option.value}
            label={option.label}
            checked={activeValues.includes(option.value)}
            onCheckedChange={(checked) => handleCheckChange(option.value, checked as boolean)}
            disabled={option.disabled}
            value={option.value}
          />
        ))}
      </div>

      {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
