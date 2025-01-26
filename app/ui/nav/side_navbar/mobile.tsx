
'use client'
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import {Logo} from '@/app/ui';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';
import { shouldHide } from '@/app/lib/helpers';

interface MobileNavProps {
    children: React.ReactNode;
    isOpen: boolean;
    onToggleMenu: () => void;
}
export default function MobileNav({ 
isOpen,
children,
onToggleMenu

}: MobileNavProps){
  const pathname = usePathname();
  const pathsToHide = ['/dashboard/charts'];
  const hide = (shouldHide(pathname, pathsToHide))

  
    return(
      <div className="lg:hidden w-full p-4 fixed top-0 z-50 opacity-95">
{       !hide && <div className=' flex flex-row justify-between bg-transparent items-center'>
          <Link
            className="flex items-center justify-start rounded-ful z-50"
            href="/"
          >
          <Logo
              src={'/chartwise-icon.png'}
              alt={'logo'}
              width={100}
              height={100}
            />
          </Link>
          <div className='flex flex-row justify-end items-center ml-auto'>
            <button
              className={`flex z-50`}
              onClick={onToggleMenu}
            >
              <FontAwesomeIcon icon={isOpen? faClose: faBars} size="lg" className="w-6 h-6" />
            </button>
          </div>
        </div>}

        {isOpen && (
        <div className=" absolute top-0 right-0 flex flex-col w-full min-h-screen bg-gray-100 dark:bg-gray-800 border border-r-1 border-gray-700 pt-16 pb-32  p-2">
          {children}
      </div>
        )}
    </div>
    )
}