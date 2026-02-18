import * as React from 'react';
import { Alert as ShadcnAlert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

interface LegacyAlertProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  icon?: React.ReactNode | boolean;
}

export default function AlertAdapter({
  title,
  description,
  children,
  variant = 'default',
  closable,
  onClose,
  className,
  icon = true,
}: LegacyAlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  // Map legacy variants to shadcn variants
  const shadcnVariant = variant === 'error' ? 'destructive' : 'default';

  // Variant-specific styles
  const variantStyles = {
    default: '',
    success: 'border-green-200 bg-green-50 [&>svg]:text-green-600',
    error: '',
    warning: 'border-orange-200 bg-orange-50 [&>svg]:text-orange-600',
    info: 'border-blue-200 bg-blue-50 [&>svg]:text-blue-600',
  };

  // Default icons for each variant
  const defaultIcons = {
    default: null,
    success: <CheckCircle2 className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  const alertIcon = icon === true ? defaultIcons[variant] : icon;

  return (
    <ShadcnAlert variant={shadcnVariant} className={cn(variantStyles[variant], className)}>
      {alertIcon}
      <div className="flex-1">
        {title && <AlertTitle>{title}</AlertTitle>}
        {description && <AlertDescription>{description}</AlertDescription>}
        {children && <div className="mt-2">{children}</div>}
      </div>
      {closable && (
        <button
          onClick={handleClose}
          className="ml-auto -mr-2 -mt-2 rounded-lg p-1.5 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          aria-label="Close alert"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </ShadcnAlert>
  );
}

// Toast notification component using Alert
interface ToastProps {
  message: string;
  title?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Toast({
  message,
  title,
  variant = 'default',
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2">
      <AlertAdapter
        title={title}
        description={message}
        variant={variant}
        closable
        onClose={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="w-full max-w-sm shadow-lg"
      />
    </div>
  );
}

// Toast context and hook for global toast management
interface ToastContextType {
  showToast: (props: ToastProps) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([]);

  const showToast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...props, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="animate-in slide-in-from-bottom-2">
            <AlertAdapter
              title={toast.title}
              description={toast.message}
              variant={toast.variant}
              closable
              onClose={() => {
                removeToast(toast.id);
                toast.onClose?.();
              }}
              className="w-full max-w-sm shadow-lg"
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
