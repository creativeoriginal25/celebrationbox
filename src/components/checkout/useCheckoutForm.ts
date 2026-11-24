import { useState, useEffect, useCallback, useMemo } from 'react';
import { CHECKOUT_CONFIG } from './checkoutConfig';

export type CheckoutStep = 1 | 2 | 3;
export type FulfilmentMethod = 'pickup' | 'delivery';

export interface FormFields {
  customerName: string;
  customerPhone: string;
  quantity: number;
  deliveryMethod: FulfilmentMethod;
  deliveryAddress: string;
  personalMessage: string;
  celebrationDate: string;
  preferredTime: string;
  selectedProductId: string;
  referralCode?: string;
  wantsLightingRental?: boolean;
}

export interface FormErrors {
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  referralCode?: string;
}

const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

export const cleanPhoneDigits = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    return digits.slice(2);
  }
  return digits.slice(0, 10);
};

export const useCheckoutForm = (initialProductId?: string) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);

  const [formData, setFormData] = useState<FormFields>(() => {
    const defaultData: FormFields = {
      customerName: '',
      customerPhone: '',
      quantity: 1,
      deliveryMethod: 'pickup',
      deliveryAddress: '',
      personalMessage: '',
      celebrationDate: '',
      preferredTime: CHECKOUT_CONFIG.timeSlots[2] || 'Evening (4:00 PM - 7:00 PM)',
      selectedProductId: initialProductId || CHECKOUT_CONFIG.defaultProductId,
      referralCode: '',
      wantsLightingRental: false,
    };

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CHECKOUT_CONFIG.storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...defaultData,
            ...parsed,
            selectedProductId: initialProductId || parsed.selectedProductId || CHECKOUT_CONFIG.defaultProductId,
          };
        }
      } catch (err) {
        console.warn('Failed to recover checkout draft:', err);
      }
    }
    return defaultData;
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Persist draft on changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const { customerName, customerPhone, quantity, deliveryMethod, deliveryAddress, personalMessage, celebrationDate, preferredTime, selectedProductId, wantsLightingRental } = formData;
      localStorage.setItem(
        CHECKOUT_CONFIG.storageKey,
        JSON.stringify({
          customerName,
          customerPhone,
          quantity,
          deliveryMethod,
          deliveryAddress,
          personalMessage,
          celebrationDate,
          preferredTime,
          selectedProductId,
          wantsLightingRental,
        })
      );
    } catch {
      // LocalStorage quota or access error
    }
  }, [formData]);

  // Sync initialProductId when it changes
  useEffect(() => {
    if (initialProductId) {
      setFormData((prev) => ({ ...prev, selectedProductId: initialProductId }));
    }
  }, [initialProductId]);

  // Validation functions
  const validateName = useCallback((name: string): string | undefined => {
    const trimmed = name.trim();
    if (!trimmed) return 'Full name is required';
    if (trimmed.length < 2) return 'Name must be at least 2 characters';
    return undefined;
  }, []);

  const validatePhone = useCallback((phone: string): string | undefined => {
    const cleaned = cleanPhoneDigits(phone);
    if (!cleaned) return 'WhatsApp mobile number is required';
    if (cleaned.length < 10) return 'Please enter a complete 10-digit number';
    if (!INDIAN_PHONE_REGEX.test(cleaned)) {
      return 'Enter a valid Indian mobile number starting with 6, 7, 8, or 9';
    }
    return undefined;
  }, []);

  const validateAddress = useCallback((addr: string, method: FulfilmentMethod): string | undefined => {
    if (method !== 'delivery') return undefined;
    const trimmed = addr.trim();
    if (!trimmed) return 'Delivery address and landmark are required';
    if (trimmed.length < 5) return 'Please provide a more detailed address/landmark';
    return undefined;
  }, []);

  // Compute live validation errors
  const errors: FormErrors = useMemo(() => {
    const errs: FormErrors = {};
    if (touched.customerName) {
      errs.customerName = validateName(formData.customerName);
    }
    if (touched.customerPhone) {
      errs.customerPhone = validatePhone(formData.customerPhone);
    }
    if (touched.deliveryAddress) {
      errs.deliveryAddress = validateAddress(formData.deliveryAddress, formData.deliveryMethod);
    }
    return errs;
  }, [formData, touched, validateName, validatePhone, validateAddress]);

  // Step validity checks
  const isStep1Valid = useMemo(() => {
    const nameErr = validateName(formData.customerName);
    const phoneErr = validatePhone(formData.customerPhone);
    const qtyValid = formData.quantity >= 1 && formData.quantity <= 10;
    return !nameErr && !phoneErr && qtyValid;
  }, [formData.customerName, formData.customerPhone, formData.quantity, validateName, validatePhone]);

  const isStep2Valid = useMemo(() => {
    if (formData.deliveryMethod === 'delivery') {
      return !validateAddress(formData.deliveryAddress, 'delivery');
    }
    return true;
  }, [formData.deliveryMethod, formData.deliveryAddress, validateAddress]);

  // Field change handler
  const setField = useCallback(<K extends keyof FormFields>(key: K, value: FormFields[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const markTouched = useCallback((key: keyof FormFields) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const setQuantity = useCallback((delta: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, Math.min(10, prev.quantity + delta)),
    }));
  }, []);

  // Navigation handlers
  const nextStep = useCallback(() => {
    if (currentStep === 1) {
      // Touch all Step 1 fields
      setTouched((prev) => ({ ...prev, customerName: true, customerPhone: true }));
      if (isStep1Valid) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (formData.deliveryMethod === 'delivery') {
        setTouched((prev) => ({ ...prev, deliveryAddress: true }));
      }
      if (isStep2Valid) {
        setCurrentStep(3);
      }
    }
  }, [currentStep, isStep1Valid, isStep2Valid, formData.deliveryMethod]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as CheckoutStep);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: CheckoutStep) => {
    if (step === 1) {
      setCurrentStep(1);
    } else if (step === 2 && isStep1Valid) {
      setCurrentStep(2);
    } else if (step === 3 && isStep1Valid && isStep2Valid) {
      setCurrentStep(3);
    }
  }, [isStep1Valid, isStep2Valid]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(CHECKOUT_CONFIG.storageKey);
    } catch {
      // ignore
    }
  }, []);

  const hasUnsavedChanges = useMemo(() => {
    return (
      formData.customerName.trim().length > 0 ||
      formData.customerPhone.trim().length > 0 ||
      formData.deliveryAddress.trim().length > 0 ||
      formData.personalMessage.trim().length > 0
    );
  }, [formData]);

  return {
    currentStep,
    formData,
    touched,
    errors,
    isStep1Valid,
    isStep2Valid,
    hasUnsavedChanges,
    setField,
    markTouched,
    setQuantity,
    nextStep,
    prevStep,
    goToStep,
    clearDraft,
  };
};
