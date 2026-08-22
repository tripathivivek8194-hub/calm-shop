/* useWizard Hook - Conversational Form Flow */
import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useWizard(steps, options = {}) {
  const {
    storageKey = 'auth-wizard',
    persistData = true,
    onComplete,
  } = options;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [data, setData] = useState(() => {
    if (!persistData) return {};
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Persist data changes
  useEffect(() => {
    if (persistData && Object.keys(data).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, persistData, storageKey]);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const validateStep = useCallback((stepIndex, stepData) => {
    const step = steps[stepIndex];
    if (!step.validate) return { valid: true, errors: {} };

    const newErrors = {};
    let valid = true;

    for (const [field, validator] of Object.entries(step.validate)) {
      const value = stepData[field];
      const result = validator(value);
      if (!result) {
        valid = false;
        newErrors[field] = step.errorMessages?.[field] || `${field} is invalid`;
      }
    }

    return { valid, errors: newErrors };
  }, [steps]);

  const next = useCallback(async () => {
    const validation = validateStep(currentStepIndex, data);
    if (!validation.valid) {
      setErrors(validation.errors);
      return false;
    }

    setErrors({});
    if (isLastStep) {
      setIsSubmitting(true);
      try {
        if (onComplete) await onComplete(data);
        setIsComplete(true);
        if (persistData) localStorage.removeItem(storageKey);
      } finally {
        setIsSubmitting(false);
      }
      return true;
    }

    setCurrentStepIndex((prev) => prev + 1);
    return true;
  }, [currentStepIndex, data, isLastStep, onComplete, persistData, storageKey, validateStep]);

  const back = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
      setErrors({});
    }
  }, [isFirstStep]);

  const goToStep = useCallback((index) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
      setErrors({});
    }
  }, [steps.length]);

  const updateData = useCallback((field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const updateMultiple = useCallback((newData) => {
    setData((prev) => ({ ...prev, ...newData }));
  }, []);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setData({});
    setErrors({});
    setIsSubmitting(false);
    setIsComplete(false);
    if (persistData) localStorage.removeItem(storageKey);
  }, [persistData, storageKey]);

  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  return {
    // State
    currentStep,
    currentStepIndex,
    data,
    errors,
    isSubmitting,
    isComplete,
    isFirstStep,
    isLastStep,
    progress,
    steps,

    // Actions
    next,
    back,
    goToStep,
    updateData,
    updateMultiple,
    reset,
    setFieldError,
    validateStep,
  };
}

/* Step definitions for Auth Wizard */
export const authWizardSteps = [
  {
    id: 'welcome',
    title: 'Welcome back!',
    message: 'Let\'s get you signed in. What\'s your email?',
    fields: ['email'],
    validate: {
      email: (v) => v && v.includes('@') && v.includes('.'),
    },
    errorMessages: {
      email: 'Please enter a valid email address',
    },
  },
  {
    id: 'verify',
    title: 'Check your inbox',
    message: 'We\'ve sent a 6-digit code to {email}. Enter it here:',
    fields: ['code'],
    validate: {
      code: (v) => v && v.length === 6 && /^\d+$/.test(v),
    },
    errorMessages: {
      code: 'Please enter the 6-digit code',
    },
  },
  {
    id: 'name',
    title: 'Nice! What should we call you?',
    message: 'Enter your name so we can personalize your experience.',
    fields: ['name'],
    validate: {
      name: (v) => v && v.trim().length >= 2,
    },
    errorMessages: {
      name: 'Please enter your name (at least 2 characters)',
    },
  },
  {
    id: 'password',
    title: 'Create a password (optional)',
    message: 'Add a password for extra security, or skip for now.',
    fields: ['password'],
    validate: {
      password: (v) => !v || v.length >= 8,
    },
    errorMessages: {
      password: 'Password must be at least 8 characters',
    },
    optional: true,
  },
];

export const signupWizardSteps = [
  {
    id: 'email',
    title: 'Let\'s create your account',
    message: 'What\'s your email address?',
    fields: ['email'],
    validate: {
      email: (v) => v && v.includes('@') && v.includes('.'),
    },
    errorMessages: {
      email: 'Please enter a valid email address',
    },
  },
  {
    id: 'verify',
    title: 'Verify your email',
    message: 'We\'ve sent a 6-digit code to {email}. Enter it here:',
    fields: ['code'],
    validate: {
      code: (v) => v && v.length === 6 && /^\d+$/.test(v),
    },
    errorMessages: {
      code: 'Please enter the 6-digit code',
    },
  },
  {
    id: 'name',
    title: 'What\'s your name?',
    message: 'So we know what to call you.',
    fields: ['name'],
    validate: {
      name: (v) => v && v.trim().length >= 2,
    },
    errorMessages: {
      name: 'Please enter your name (at least 2 characters)',
    },
  },
  {
    id: 'password',
    title: 'Create a password',
    message: 'At least 8 characters with upper, lower, and number.',
    fields: ['password'],
    validate: {
      password: (v) => v && v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v),
    },
    errorMessages: {
      password: 'Must be 8+ chars with upper, lower, and number',
    },
  },
];