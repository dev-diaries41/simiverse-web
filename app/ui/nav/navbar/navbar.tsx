'use client'
import React, {useState } from 'react';
import { NavItems } from '../nav-items';
import { headerLinks } from '@/app/constants/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(prev => !prev)
  };



  return (
    <nav className='flex items-center justify-center gap-5'>
      <div className="md:hidden">
        <div className='flex flex-row justify-center items-center gap-4'>
        <button
          onClick={toggleMenu}
          className="navbar-toggler relative z-50"
          type="button"
        >
         <FontAwesomeIcon icon={isOpen? faTimes: faBars} className='w-6 h-6'/>
        </button>
        </div>
       

        {/* Dropdown menu */}
       {isOpen&&  <div className="absolute top-0 right-0 w-full bg-gray-800 border border-r-1 border-gray-700 pt-16 p-4 z-40" id='navbar-menu'>
          <NavItems navItems={headerLinks} />
        </div>}

      </div>
      <div className="md:flex items-center gap-5 hidden">
        <NavItems navItems={headerLinks} />
      </div>
    </nav>
  );
}
