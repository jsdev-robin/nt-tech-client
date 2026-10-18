'use client';

import { useEffect, useRef } from 'react';

const useSticky = (
  topOffset = 16,
  ready = true,
  containerId = 'dashboard-layout',
) => {
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;

    const el = stickyRef.current;
    const container = document.getElementById(containerId);

    if (!el || !container) return;

    container.style.overflow = 'unset';
    el.style.position = 'sticky';
    el.style.top = `${topOffset}px`;

    return () => {
      container.style.overflow = '';
      el.style.position = '';
      el.style.top = '';
    };
  }, [topOffset, containerId, ready]);

  return stickyRef;
};

export default useSticky;
