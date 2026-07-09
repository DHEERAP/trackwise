'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const useScrollToTop = () => {
  const pathname = usePathname();
  useEffect(() => {
    const main = document.getElementById('main-content');
    if (main) main.scrollTop = 0;
  }, [pathname]);
};
