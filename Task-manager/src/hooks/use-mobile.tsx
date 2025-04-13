import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handleViewportChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    mediaQuery.addEventListener('change', handleViewportChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    return () => {
      mediaQuery.removeEventListener('change', handleViewportChange);
    };
  }, []);

  return !!isMobile;
}
