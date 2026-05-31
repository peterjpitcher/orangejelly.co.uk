import Navigation from '@/components/Navigation';
import navigationData from '../../content/data/navigation.json';
import { SEASON_HUBS } from '@/lib/seasonal-hubs';

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

// Sub-links for each seasonal hub, driven from SEASON_HUBS so the nav and the
// hub pages stay in sync (e.g. "Autumn Playbook", "Christmas Playbook").
const seasonalPlaybookLinks: NavigationLink[] = SEASON_HUBS.map((hub, index) => ({
  label: hub.shortLabel,
  href: `/licensees-guide/${hub.hubSlug}`,
  order: index + 2, // sit after the static "The Licensee's Guide" entry (order 1)
}));

// Sort children by order and append the seasonal playbooks for items that
// already declare children (currently the "Guides" item).
function withChildren(link: NavigationLink): NavigationLink {
  if (!link.children || link.children.length === 0) {
    return link;
  }
  const merged = [...link.children, ...seasonalPlaybookLinks].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
  return { ...link, children: merged };
}

export default function NavigationWrapper() {
  // Sort top-level navigation items by order, then enrich any with children.
  const sortedMainMenu = [...navigationData.mainMenu]
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(withChildren);
  const sortedMobileMenu = navigationData.mobileMenu
    ? [...navigationData.mobileMenu]
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(withChildren)
    : sortedMainMenu;

  const localNavigation: LocalNavigationType = {
    mainMenu: sortedMainMenu,
    mobileMenu: sortedMobileMenu,
    whatsappCta: navigationData.whatsappCta,
  };

  return <Navigation navigation={localNavigation} />;
}
