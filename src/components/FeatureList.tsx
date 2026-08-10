import { memo } from 'react';

interface FeatureListProps {
  items: string[];
  icon?: 'check' | 'cross' | 'arrow' | 'star' | 'bullet';
  /**
   * `orange` is the light-surface accent. Use `orange-on-dark` inside a navy band:
   * the brand orange is 2.79:1 on cream but 4.55:1 on navy, and orange-dark is the
   * reverse, so the correct value depends on what the list is sitting on.
   */
  iconColor?: 'orange' | 'orange-on-dark' | 'green' | 'red' | 'blue-support';
  spacing?: 'tight' | 'normal' | 'loose';
  columns?: 1 | 2 | 3;
  className?: string;
}

function FeatureList({
  items,
  icon = 'check',
  iconColor = 'orange',
  spacing = 'normal',
  columns = 1,
  className = '',
}: FeatureListProps) {
  const icons = {
    check: '✓',
    cross: '✗',
    arrow: '→',
    star: '★',
    bullet: '•',
  };

  const colors = {
    // green-700, not green-600: 3.08:1 on cream and 3.30:1 on white, both under AA.
    orange: 'text-orange-dark',
    'orange-on-dark': 'text-orange',
    green: 'text-green-700',
    red: 'text-red-600',
    'blue-support': 'text-blue-support',
  };

  const spacings = {
    tight: 'space-y-1',
    normal: 'space-y-2',
    loose: 'space-y-3',
  };

  const gridColumns = {
    1: '',
    2: 'sm:grid sm:grid-cols-2 sm:gap-4',
    3: 'sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4',
  };

  return (
    <ul
      className={`${gridColumns[columns]} ${columns === 1 ? spacings[spacing] : ''} ${className}`}
    >
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className={`${colors[iconColor]} mr-2 mt-0.5 flex-shrink-0`}>{icons[icon]}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default memo(FeatureList);
