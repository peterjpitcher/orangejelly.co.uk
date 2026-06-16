'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import OptimizedImage from './OptimizedImage';
import WhatsAppButton from './WhatsAppButton';
import { cn } from '@/lib/utils';
import { trackClientEvent } from '@/lib/tracking';

// Define local navigation type interface
interface NavigationLink {
  label: string;
  href: string;
  order?: number;
  children?: NavigationLink[];
}

interface WhatsAppCta {
  enabled: boolean;
  text: string;
  phoneNumber: string;
  showInDesktop: boolean;
  showInMobile: boolean;
}

interface LocalNavigationType {
  mainMenu: NavigationLink[];
  mobileMenu?: NavigationLink[];
  whatsappCta: WhatsAppCta;
}

interface NavigationProps {
  navigation?: LocalNavigationType;
}

export default function Navigation({ navigation }: NavigationProps) {
  const pathname = usePathname();

  // Navigation must be provided
  const navLinks = navigation?.mainMenu || [];

  // Use mobile menu if specified, otherwise use main menu
  const mobileNavLinks =
    navigation?.mobileMenu && navigation.mobileMenu.length > 0 ? navigation.mobileMenu : navLinks;

  // Don't render if no navigation data at all
  if (navLinks.length === 0 && mobileNavLinks.length === 0) {
    return null;
  }

  // WhatsApp CTA configuration from local data
  const whatsappCta = navigation?.whatsappCta || {
    enabled: true,
    text: "Hi Peter, I'd like help building momentum for my venue.",
    phoneNumber: '+447990587315',
    showInDesktop: true,
    showInMobile: true,
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-base text-white" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 md:h-16 items-center justify-between">
        {/* Mobile logo */}
        <Link href="/" className="flex md:hidden items-center space-x-2">
          <OptimizedImage
            src="/logo.png"
            alt="Orange Jelly"
            width={40}
            height={40}
            priority
            className="rounded-lg"
            style={{ width: '40px', height: '40px' }}
          />
          <span className="font-bold text-sm">Orange Jelly</span>
        </Link>

        {/* Desktop navigation */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <OptimizedImage
              src="/logo.png"
              alt="Orange Jelly"
              width={48}
              height={48}
              className="rounded-lg"
              priority
              style={{ width: '48px', height: '48px' }}
            />
            <span className="hidden font-bold sm:inline-block">Orange Jelly</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => {
                const children = link.children ?? [];
                const hasChildren = children.length > 0;
                const isActive =
                  pathname === link.href ||
                  (hasChildren && children.some((child) => pathname === child.href));

                if (hasChildren) {
                  return (
                    <NavigationMenuItem key={link.href}>
                      <NavigationMenuTrigger
                        className={cn(
                          'h-12 py-3',
                          'bg-transparent text-white/90 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10',
                          isActive && 'bg-brand text-white hover:bg-brand/90'
                        )}
                      >
                        {link.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-64 gap-1 p-2">
                          {children.map((child) => (
                            <li key={child.href}>
                              <Link href={child.href} legacyBehavior passHref>
                                <NavigationMenuLink
                                  className={cn(
                                    'block select-none rounded-md px-3 py-2 text-sm font-medium leading-none text-charcoal no-underline outline-none transition-colors hover:bg-teal/10 hover:text-teal focus:bg-teal/10 focus:text-teal',
                                    pathname === child.href && 'bg-accent text-teal'
                                  )}
                                >
                                  {child.label}
                                </NavigationMenuLink>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                }

                return (
                  <NavigationMenuItem key={link.href}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          'h-12 py-3',
                          'bg-transparent text-white/90 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10',
                          isActive && 'bg-brand text-white hover:bg-brand/90'
                        )}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* Mobile controls container - WhatsApp and Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {/* WhatsApp button for mobile — icon only to avoid overlap */}
          {whatsappCta.enabled && whatsappCta.showInMobile && (
            <a
              href={`https://wa.me/${whatsappCta.phoneNumber}?text=${encodeURIComponent(whatsappCta.text)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] h-10 w-10 rounded-lg bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors"
              aria-label="Chat on WhatsApp"
              onClick={() =>
                trackClientEvent('whatsapp_click', {
                  properties: {
                    cta: 'mobile_navigation_whatsapp',
                    source: 'navigation',
                  },
                })
              }
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          )}

          {/* Mobile menu hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:pointer-events-none disabled:opacity-50 hover:bg-white/10 hover:text-white min-h-[44px] min-w-[44px] h-11 w-11"
                aria-label="Open navigation menu"
              >
                <svg
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                >
                  <path
                    d="M3 5H11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M3 12H16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M3 19H21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-cream">
              <Link href="/" className="flex items-center">
                <OptimizedImage
                  src="/logo.png"
                  alt="Orange Jelly"
                  width={48}
                  height={48}
                  priority
                  className="rounded-lg"
                />
                <span className="ml-2 font-bold">Orange Jelly</span>
              </Link>
              <div className="mt-4">
                {mobileNavLinks.map((link) => {
                  const children = link.children ?? [];
                  return (
                    <div key={link.href}>
                      <SheetClose asChild>
                        <Link
                          href={link.href}
                          className={cn(
                            'block py-3 px-4 min-h-[44px] flex items-center text-charcoal hover:text-teal hover:bg-teal/10 rounded-lg transition-quick',
                            pathname === link.href && 'bg-accent'
                          )}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                      {children.length > 0 && (
                        <div className="ml-4 border-l border-charcoal/10 pl-2">
                          {children.map((child) => (
                            <SheetClose key={child.href} asChild>
                              <Link
                                href={child.href}
                                className={cn(
                                  'block py-2.5 px-4 min-h-[44px] flex items-center text-sm text-charcoal/80 hover:text-teal hover:bg-teal/10 rounded-lg transition-quick',
                                  pathname === child.href && 'bg-accent text-teal'
                                )}
                              >
                                {child.label}
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {whatsappCta.enabled && whatsappCta.showInMobile && (
                <div className="mt-4">
                  <WhatsAppButton
                    text={whatsappCta.text}
                    phoneNumber={whatsappCta.phoneNumber}
                    fullWidth
                    label="Chat on WhatsApp"
                    showPhone={false}
                    trustText=""
                  />
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop WhatsApp button */}
        <div className="hidden md:flex shrink-0 items-center ml-auto">
          {whatsappCta.enabled && whatsappCta.showInDesktop && (
            <WhatsAppButton
              text={whatsappCta.text}
              phoneNumber={whatsappCta.phoneNumber}
              size="small"
              label="Chat on WhatsApp"
              showPhone={false}
              trustText=""
            />
          )}
        </div>
      </div>
    </header>
  );
}
