import Link from "next/link";
import React from "react";
import {NavItemsProps} from '@/app/types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export const NavItems = ({ navItems }: NavItemsProps) => {
  return (
    <>
      {navItems.map((navItem, index) => {
        return (
          <Link
          key={navItem.name}
          href={navItem.link}
          className={'flex h-10 grow items-center justify-center gap-2 rounded-md bg-transparent font-medium hover:bg-gray-200 dark:hover:bg-gray-700 justify-start p-2 px-3'}
          {...(navItem.newPage
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {navItem.icon && <FontAwesomeIcon icon={navItem.icon} className="w-4 h-4" />}
          <span className="w-full">{navItem.name}</span>
        </Link>
        );
      })}
    </>
  );
};
