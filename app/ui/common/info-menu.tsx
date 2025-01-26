'use client'
import React, { useState } from 'react';
import { navLinks } from '@/app/constants/navigation';
import { NavItems } from '../nav/nav-items';

export default function InformationMenu () {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const filteredFooterLinks = navLinks.filter(footerLink => !['Pricing', 'Home'].includes(footerLink.name))


  return (
    <div className="relative hidden md:block">
      <button
        onClick={toggleMenu}
        className="bg-neutral-400 dark:bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl focus:outline-none shadow-md shadow-black"
      >
        ?
      </button>
      {isOpen && (
        <div className="absolute bottom-12 right-0 p-2 bg-neutral-200 dark:bg-gray-800 border border-gray-700 rounded-md shadow-lg w-48 z-10">
         <NavItems navItems={filteredFooterLinks}/>
        </div>
      )}
    </div>
  );
};
