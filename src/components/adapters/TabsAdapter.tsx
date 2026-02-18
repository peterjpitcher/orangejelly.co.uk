import * as React from 'react';
import { Tabs as ShadcnTabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Heading from '@/components/Heading';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface LegacyTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  // SEO props
  itemScope?: boolean;
  itemType?: string;
}

export default function TabsAdapter({
  tabs,
  defaultValue,
  value,
  onValueChange,
  orientation = 'horizontal',
  className,
  variant = 'default',
  itemScope,
  itemType,
}: LegacyTabsProps) {
  const defaultTab = defaultValue || tabs[0]?.id;

  const tabsListClasses = cn(
    variant === 'pills' && 'bg-muted p-1 rounded-lg',
    variant === 'underline' && 'border-b bg-transparent p-0',
    orientation === 'vertical' && 'flex-col h-auto'
  );

  const tabsTriggerClasses = cn(
    variant === 'pills' && 'data-[state=active]:bg-white data-[state=active]:shadow-sm',
    variant === 'underline' &&
      'rounded-none border-b-2 border-transparent data-[state=active]:border-primary'
  );

  return (
    <ShadcnTabs
      defaultValue={defaultTab}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      className={cn('w-full', className)}
      itemScope={itemScope}
      itemType={itemType}
    >
      <TabsList className={tabsListClasses}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            disabled={tab.disabled}
            className={tabsTriggerClasses}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4">
          {tab.content}
        </TabsContent>
      ))}
    </ShadcnTabs>
  );
}

// Service tabs component with SEO schema
interface ServiceTab {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  price?: string;
  icon?: React.ReactNode;
}

interface ServiceTabsProps {
  services: ServiceTab[];
  defaultService?: string;
  className?: string;
}

export function ServiceTabs({ services, defaultService, className }: ServiceTabsProps) {
  const schemaMarkup = React.useMemo(() => {
    const servicesSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: services.map((service, index) => ({
        '@type': 'Service',
        position: index + 1,
        name: service.title,
        description: service.description,
        offers: service.price
          ? {
              '@type': 'Offer',
              price: service.price,
              priceCurrency: 'GBP',
            }
          : undefined,
      })),
    };

    return JSON.stringify(servicesSchema);
  }, [services]);

  const tabs: TabItem[] = services.map((service) => ({
    id: service.id,
    label: service.title,
    content: (
      <div itemScope itemType="https://schema.org/Service">
        <Heading level={3} itemProp="name" className="sr-only">
          {service.title}
        </Heading>
        <p itemProp="description" className="sr-only">
          {service.description}
        </p>
        {service.content}
      </div>
    ),
    icon: service.icon,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaMarkup }} />
      <TabsAdapter
        tabs={tabs}
        defaultValue={defaultService}
        className={className}
        variant="pills"
        itemScope
        itemType="https://schema.org/ItemList"
      />
    </>
  );
}
