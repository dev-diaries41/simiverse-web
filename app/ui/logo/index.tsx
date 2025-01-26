import React from 'react';
import Image from 'next/image';
import { LogoProps } from '@/app/types';

export default function Logo({
  src,
  alt = 'logo',
  width = 100,
  height = 100,
}: LogoProps) {
  return (
    <div className='flex items-center space-x-1 p-2'>
       <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="relative md:max-w-12 md:max-h-12 max-w-10 max-h-10 invert dark:invert-0"
            priority={true}
          />
        <h1 className='w-full text-md md:text-lg font-semibold'>
        Simiverse
        </h1>
    </div>
  );
};
