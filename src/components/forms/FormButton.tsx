'use client';

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'base' | 'support' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
}

export default function FormButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  loadingText = 'Loading...',
  className = '',
  disabled,
  ...props
}: FormButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-orange text-white hover:bg-orange-dark focus:ring-orange/50',
    secondary: 'bg-teal text-white hover:bg-teal-dark focus:ring-teal/50',
    outline: 'bg-transparent text-orange border-2 border-orange hover:bg-orange hover:text-white focus:ring-orange/50',
    base: 'bg-charcoal text-white hover:bg-charcoal-light focus:ring-charcoal/50',
    support: 'bg-teal text-white hover:bg-teal-dark focus:ring-teal/50',
    accent: 'bg-orange text-white hover:bg-orange-dark focus:ring-orange/50',
  };

  const buttonClasses = `
    inline-flex items-center justify-center
    font-semibold rounded-lg transition-all
    focus:outline-none focus:ring-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
