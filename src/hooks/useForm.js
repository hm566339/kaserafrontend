import { useCallback, useState } from "react";

export const useForm = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const setValue = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const setValues = useCallback((newValues) => {
    setFormData((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  const reset = useCallback((data = initialData) => {
    setFormData(data);
    setTouched({});
    setErrors({});
  }, [initialData]);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const validate = useCallback((validationSchema) => {
    const newErrors = {};
    validationSchema.forEach(({ name, rules }) => {
      const value = formData[name];
      for (const rule of rules) {
        const error = rule(value);
        if (error) {
          newErrors[name] = error;
          break;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  return {
    formData,
    setFormData,
    setValue,
    setValues,
    reset,
    errors,
    setFieldError,
    touched,
    validate,
  };
};
