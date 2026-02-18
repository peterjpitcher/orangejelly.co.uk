import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface LegacySelectProps {
  label?: string;
  options: SelectOption[] | SelectGroup[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export default function SelectAdapter({
  label,
  options,
  value,
  defaultValue,
  placeholder = 'Select an option',
  onChange,
  error,
  helperText,
  disabled,
  required,
  className,
  id,
  name,
}: LegacySelectProps) {
  const generatedId = React.useId();
  const selectId = id || generatedId;

  // Check if options are grouped
  const isGrouped = options.length > 0 && 'options' in options[0];

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={selectId} className={cn(error && 'text-destructive')}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          id={selectId}
          className={cn(error && 'border-destructive focus-visible:ring-destructive', className)}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
          }
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {isGrouped
            ? // Render grouped options
              (options as SelectGroup[]).map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map((option) => (
                    <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))
            : // Render flat options
              (options as SelectOption[]).map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>

      {helperText && !error && (
        <p id={`${selectId}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}

      {error && (
        <p id={`${selectId}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
