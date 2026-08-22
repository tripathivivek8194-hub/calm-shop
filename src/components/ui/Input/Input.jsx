/* Input Component */
import { useId } from 'react';
import './Input.css';

export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled = false,
  required = false,
  readOnly = false,
  leftIcon,
  rightIcon,
  className = '',
  autoComplete,
  inputMode,
  maxLength,
  min,
  max,
  step,
  pattern,
  'aria-describedby': ariaDescribedBy,
  ...props
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const describedBy = [error && errorId, helperText && helperId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`input-wrapper ${className} ${error ? 'has-error' : ''} ${disabled ? 'disabled' : ''}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="input-field-wrapper">
        {leftIcon && (
          <span className="input-icon input-icon-left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className="input-field"
          {...props}
        />
        {rightIcon && (
          <span className="input-icon input-icon-right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className="input-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="input-helper">
          {helperText}
        </p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled = false,
  required = false,
  readOnly = false,
  rows = 4,
  maxLength,
  className = '',
  'aria-describedby': ariaDescribedBy,
  ...props
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const describedBy = [error && errorId, helperText && helperId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`input-wrapper ${className} ${error ? 'has-error' : ''} ${disabled ? 'disabled' : ''}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className="input-field textarea-field"
        {...props}
      />
      {error && (
        <p id={errorId} className="input-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="input-helper">
          {helperText}
        </p>
      )}
      {maxLength && (
        <p className="input-counter" aria-hidden="true">
          {value?.length || 0} / {maxLength}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled = false,
  required = false,
  options = [],
  className = '',
  'aria-describedby': ariaDescribedBy,
  ...props
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const describedBy = [error && errorId, helperText && helperId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`input-wrapper ${className} ${error ? 'has-error' : ''} ${disabled ? 'disabled' : ''}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="select-wrapper">
        <select
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className="input-field select-field"
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="select-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      {error && (
        <p id={errorId} className="input-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="input-helper">
          {helperText}
        </p>
      )}
    </div>
  );
}