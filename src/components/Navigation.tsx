'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import OptimizedImage from './OptimizedImage';
import WhatsAppButton from './WhatsAppButton';
import { cn } from '@/lib/utils';

// Define local navigation type interface
interface NavigationLink {
  label: string;
  href: string;
  order?: number;
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
    <header className="sticky top-0 z-50 w-full bg-brand-base text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between">
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
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'bg-transparent text-white/90 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10',
                        pathname === link.href && 'bg-brand text-white hover:bg-brand/90'
                      )}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* Mobile controls container - WhatsApp and Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {/* WhatsApp button for mobile */}
          {whatsappCta.enabled && whatsappCta.showInMobile && (
            <WhatsAppButton
              text={whatsappCta.text}
              phoneNumber={whatsappCta.phoneNumber}
              size="small"
              label="Chat on WhatsApp"
              showPhone={false}
            />
          )}

          {/* Mobile menu hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
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
                <span className="sr-only">Toggle Menu</span>
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
                {mobileNavLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
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
                ))}
              </div>
              {whatsappCta.enabled && whatsappCta.showInMobile && (
                <div className="mt-4">
                  <WhatsAppButton
                    text={whatsappCta.text}
                    phoneNumber={whatsappCta.phoneNumber}
                    fullWidth
                    label="Chat on WhatsApp"
                    showPhone={false}
                  />
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop WhatsApp button */}
        <div className="hidden md:flex flex-1 items-center justify-end">
          {whatsappCta.enabled && whatsappCta.showInDesktop && (
            <WhatsAppButton
              text={whatsappCta.text}
              phoneNumber={whatsappCta.phoneNumber}
              size="small"
              label="Chat on WhatsApp"
              showPhone={false}
            />
          )}
        </div>
      </div>
    </header>
  );
}
