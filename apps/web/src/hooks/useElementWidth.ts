import { useEffect, useRef } from 'react';

export const useElementWidth = <T extends HTMLElement>(varName: string) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const setVar = (width: number) => {
      el.style.setProperty(varName, `${width}px`);
    };

    setVar(el.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) => {
      setVar(entry.contentRect.width);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [varName]);

  return ref;
};
