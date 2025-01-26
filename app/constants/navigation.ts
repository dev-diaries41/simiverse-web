import { faBars, faExternalLink, faHome, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { NavItem } from "@/app/types";

  
  export const navLinks: NavItem[] = [
    { name: 'Home', link: '/', icon: faHome },
    { name: 'Menu', link: '/', icon: faBars },
    { name: 'Terms', link: '/terms', icon: faExternalLink, newPage: true},
  ];

  export const headerLinks = navLinks.filter(headerLink => ['Menu'].includes(headerLink.name))
  export const footerLinks = navLinks.filter(footerLink => !['Home', 'Pricing'].includes(footerLink.name))

  