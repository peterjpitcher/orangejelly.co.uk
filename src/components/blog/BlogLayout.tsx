import Breadcrumb from '@/components/Breadcrumb';
import Section from '@/components/Section';

interface BlogLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  sidebar?: React.ReactNode;
}

export default function BlogLayout({ children, breadcrumbs, sidebar }: BlogLayoutProps) {
  const defaultBreadcrumbs = [
    { label: 'Home', href: '/' },
    { label: "The Licensee's Guide", href: '/licensees-guide' },
  ];

  const finalBreadcrumbs = breadcrumbs || defaultBreadcrumbs;

  return (
    <>
      <Section background="white" padding="small">
        <div className="">
          {/* Guide routes emit the canonical trail via <BreadcrumbJsonLd />. */}
          <Breadcrumb items={finalBreadcrumbs} emitJsonLd={false} />
        </div>
      </Section>

      <Section background="white" padding="small">
        <div className="">
          {sidebar ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
              <main>{children}</main>
              <aside className="space-y-6">{sidebar}</aside>
            </div>
          ) : (
            <main>{children}</main>
          )}
        </div>
      </Section>
    </>
  );
}
