import * as React from 'react';
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import Button from '../Button';

interface LegacyDialogProps {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
}

export default function DialogAdapter({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  defaultOpen,
  onOpenChange,
  className,
  size = 'default',
}: LegacyDialogProps) {
  const contentClasses = cn(
    'gap-0',
    size === 'sm' && 'sm:max-w-[425px]',
    size === 'default' && 'sm:max-w-[525px]',
    size === 'lg' && 'sm:max-w-[725px]',
    size === 'xl' && 'sm:max-w-[925px]',
    size === 'full' && 'sm:max-w-[95vw] sm:h-[90vh]',
    className
  );

  return (
    <ShadcnDialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className={contentClasses}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        <div className="py-4">{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </ShadcnDialog>
  );
}

// Confirmation dialog component
interface ConfirmDialogProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  open,
  onOpenChange,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  return (
    <DialogAdapter
      trigger={trigger}
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            variant={variant === 'destructive' ? 'primary' : 'primary'}
            onClick={handleConfirm}
            loading={isLoading}
            className={variant === 'destructive' ? '!bg-red-600 hover:!bg-red-700' : ''}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      {/* Content is handled by title and description */}
      <div className="sr-only">Confirmation dialog</div>
    </DialogAdapter>
  );
}

// Form dialog component
interface FormDialogProps {
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  onSubmit: (data: Record<string, FormDataEntryValue>) => void | Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: 'sm' | 'default' | 'lg' | 'xl';
}

export function FormDialog({
  trigger,
  title,
  description,
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onSubmit,
  open,
  onOpenChange,
  size = 'default',
}: FormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData);
      await onSubmit(data);
      onOpenChange?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogAdapter
      trigger={trigger}
      title={title}
      description={description}
      open={open}
      onOpenChange={onOpenChange}
      size={size}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {cancelText}
            </Button>
          </DialogClose>
          <Button type="submit" loading={isLoading}>
            {submitText}
          </Button>
        </DialogFooter>
      </form>
    </DialogAdapter>
  );
}
