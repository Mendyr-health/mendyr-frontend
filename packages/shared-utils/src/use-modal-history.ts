"use client";

import { useEffect, useRef } from 'react';

/**
 * Hook to manage history state for modals so that the hardware/browser back button
 * closes the modal instead of exiting the app or navigating away from the page.
 */
export function useModalHistory(isOpen: boolean, onClose: () => void, modalId: string) {
  const isClosingViaHistory = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    
    // Safety check for SSR
    if (typeof window === 'undefined') return;

    const targetHash = `#${modalId}`;
    
    // If we aren't already on the hash, push it.
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, "", window.location.pathname + window.location.search + targetHash);
    }

    const handlePopState = () => {
      if (window.location.hash !== targetHash) {
        // The back button was pressed (hash changed away from our target)
        isClosingViaHistory.current = true;
        onClose();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      
      // If the component unmounts or isOpen becomes false due to programmatic close (e.g. 'X' button)
      // we should remove the hash from the history stack to keep it clean.
      if (!isClosingViaHistory.current && window.location.hash === targetHash) {
        window.history.back();
      }
      
      isClosingViaHistory.current = false;
    };
  }, [isOpen, onClose, modalId]);
}
