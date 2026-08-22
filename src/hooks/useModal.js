/* useModal Hook */
import { useState, useCallback, useEffect, useRef } from 'react';

export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef(null);

  const open = useCallback(() => {
    setIsAnimating(true);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const close = useCallback(() => {
    setIsAnimating(false);
    // Allow animation to complete before hiding
    setTimeout(() => {
      setIsOpen(false);
      document.body.style.overflow = '';
    }, 200);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) close(); else open();
  }, [isOpen, open, close]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) close();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen) return;

    const content = contentRef.current;
    if (!content) return;

    const focusableElements = content.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    content.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => content.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  return {
    isOpen,
    isAnimating,
    open,
    close,
    toggle,
    contentRef,
  };
}

export function useModalStack() {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((modalConfig) => {
    setModals((prev) => [...prev, { id: Date.now(), ...modalConfig }]);
  }, []);

  const closeModal = useCallback((id) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const closeTopModal = useCallback(() => {
    setModals((prev) => prev.slice(0, -1));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  return {
    modals,
    openModal,
    closeModal,
    closeTopModal,
    closeAllModals,
    hasModals: modals.length > 0,
  };
}