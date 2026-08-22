/* Modal Component */
import { useEffect, useRef, useCallback } from 'react';
import { Portal } from 'react-dom';
import { X } from 'lucide-react';
import './Modal.css';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}) {
  const contentRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      // Focus first focusable element
      setTimeout(() => {
        const focusable = contentRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus trap
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
    return () => content.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="presentation"
      aria-hidden="true"
    />
  );

  const modalDialog = (
    <div
      ref={contentRef}
      className={`modal-content modal-${size} ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledby || (title ? 'modal-title' : undefined)}
      aria-describedby={ariaDescribedby}
    >
      {(title || showCloseButton) && (
        <header className="modal-header">
          {title && (
            <h2 id="modal-title" className="modal-title">
              {title}
            </h2>
          )}
          {showCloseButton && (
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close modal"
              type="button"
            >
              <X size={20} />
            </button>
          )}
        </header>
      )}
      <div className="modal-body">
        {children}
      </div>
    </div>
  );

  return (
    <Portal>
      <>
        {modalContent}
        {modalDialog}
      </>
    </Portal>
  );
}

export function ModalFooter({ children, className = '' }) {
  return (
    <footer className={`modal-footer ${className}`}>
      {children}
    </footer>
  );
}