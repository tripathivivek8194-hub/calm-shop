/* Button Component */
import './Button.css';

export function Button({
  children,
  variant = 'primary',
  size = 'base',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  type = 'button',
  onClick,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) {
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full',
    disabled && 'btn-disabled',
    loading && 'btn-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="31.4 31.4"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      ) : (
        <>
          {leftIcon && <span className="btn-icon btn-icon-left" aria-hidden="true">{leftIcon}</span>}
          <span className="btn-text">{children}</span>
          {rightIcon && <span className="btn-icon btn-icon-right" aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}