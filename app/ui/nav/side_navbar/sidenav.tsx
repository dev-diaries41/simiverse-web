'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Logo } from '@/app/ui';
import MobileNav from './mobile';

export default React.memo(function SideNav({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280); // Default width
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Prevent background scrolling when the mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle mouse down event to start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    e.preventDefault(); // Prevent text selection while dragging
  };

  // Handle mouse move event to resize sidebar
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;

    const diff = e.clientX - startX.current;
    const newWidth = Math.max(100, startWidth.current + diff); // Prevent collapse beyond 100px
    setSidebarWidth(newWidth);
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Add event listeners for dragging
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [sidebarWidth]);

  // Handle collapse
  const handleCollapseToggle = () => {
    if (sidebarWidth > 100) {
      setSidebarWidth(100); // Collapse sidebar to minimum width
    } else {
      setSidebarWidth(280); // Expand to default width
    }
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Desktop SideNav */}
      <div
        className={`fixed flex flex-col min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-2 lg:block hidden z-[100]`}
        style={{
          width: `${sidebarWidth}px`,
          transition: 'width 0.3s ease-in-out',
        }}
      >
        <Link
          className="flex w-100 h-20 items-center justify-start rounded-3xl"
          href="/"
        >
          <Logo
            src={'/chartwise-icon.png'}
            alt={'logo'}
            width={100}
            height={100}
          />
        </Link>

        {/* Handle drag feature */}
        <div
          className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
          onMouseDown={handleMouseDown}
        />

        {/* Collapsing Button */}
        <button
          onClick={handleCollapseToggle}
          className="absolute bottom-10 left-0 bg-gray-200 p-2 rounded-full"
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>

        <div className="flex h-full flex-col justify-between">
          {children}
        </div>
      </div>

      {/* Mobile SideNav */}
      <MobileNav isOpen={isOpen} onToggleMenu={() => setIsOpen(prev => !prev)}>
        {children}
      </MobileNav>
    </>
  );
});
