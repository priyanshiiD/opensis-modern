/**
 * useAuthForm Hook
 * 
 * Custom hook for handling form state in authentication flows
 * Provides unified form handling, validation, and error management
 */

import { useState, useCallback } from 'react';

export function useAuthForm(initialValues = {}, onSubmit) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mark all fields as touched
    setTouched(
      Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit]);

  const setFieldError = useCallback((fieldName, errorMessage) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
  }, []);

  const setFormErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    formData,
    setFormData,
    errors,
    setFieldError,
    setFormErrors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  };
}
