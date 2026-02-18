'use client';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  loading?: boolean;
}

export default function Form({
  children,
  onSubmit,
  className = '',
  loading = false,
  ...props
}: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading) {
      onSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${loading ? 'opacity-60 pointer-events-none' : ''} ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}
