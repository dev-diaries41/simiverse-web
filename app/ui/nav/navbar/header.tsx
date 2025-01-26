'use client'
import React from 'react';
import { NavBar } from '../..';
import Link from 'next/link';
import Logo from '../../logo';
import { usePathname } from 'next/navigation';
import { shouldHide } from '@/app/lib/helpers';

export default function Header({...props}) {
  const pathname = usePathname();
  const pathsToHide = ['/dashboard', '/sim'];

  if(shouldHide(pathname, pathsToHide))return null;
  
  return (
    <div 
    {...props}
    className='fixed top-0 flex flex-row w-full mx-auto items-center justify-between pt-2 z-50'
    >
      <div className='flex flex-row w-full mx-auto items-center justify-between'>
      <Link href={'/'} className='z-50'>
        <Logo src={'/simiverse-logo-cr.png'}/>
      </Link>
    <NavBar/>
      </div>
    </div>
  );
};
