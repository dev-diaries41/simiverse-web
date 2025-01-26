
'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import { shouldHide } from '@/app/lib/helpers';


export default function Footer() {
  const pathname = usePathname();
  const pathsToHide = ['/dashboard', '/sim', "/"];
  const hide = shouldHide(pathname, pathsToHide)
  
  return (
    <footer className="flex flex-col  justify-end  mt-auto text-sm">
     {!hide&& <div className="flex flex-col items-center text-center justify-center px-8 gap-4  py-8">
        <div className='lg:hidden'>
        </div>
       {!hide&& <p className="text-gray-400">
          Copyright © {new Date().getFullYear()} FPF Labs. All rights reserved.
        </p>}
      </div>}
      <div className='fixed bottom-4 right-4'>
      </div>
    </footer>
  );
};
