import { memo } from 'react';

interface GridProps {
  children: React.ReactNode;
  columns?: {
    default?: 1 | 2 | 3 | 4;
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4;
  };
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

function Grid({
  children,
  columns = { default: 1, md: 2 },
  gap = 'medium',
  className = '',
}: GridProps) {
  const gaps = {
    small: 'gap-4',
    medium: 'gap-6 md:gap-8',
    large: 'gap-8 md:gap-12',
  };

  const getColumnClasses = () => {
    const classes = ['grid'];

    if (columns.default) classes.push(`grid-cols-${columns.default}`);
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);

    return classes.join(' ');
  };

  return <div className={`${getColumnClasses()} ${gaps[gap]} ${className}`}>{children}</div>;
}

export default memo(Grid);
