import { useEffect, createRef } from 'react';

const useOutsideClick = (callback: () => void) => {
  const ref = createRef<HTMLDivElement>();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback, ref]);

  return ref;
}

export default useOutsideClick;