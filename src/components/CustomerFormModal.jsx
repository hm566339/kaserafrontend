import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "../hooks/useForm";
import { DetailModal } from "./DetailModal";
import { TextInput, TextArea } from "./FormField";

const customerValidation = [
  {
    name: "name",
    rules: [
      (value) => (!value ? "Customer name is required" : null),
      (value) => (value?.length < 2 ? "Name must be at least 2 characters" : null),
    ],
  },
  {
    name: "email",
    rules: [
      (value) => (!value ? "Email is required" : null),
      (value) =>
        value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Invalid email format"
          : null,
    ],
  },
  {
    name: "phone",
    rules: [
      (value) => (!value ? "Phone is required" : null),
      (value) => (value?.length < 10 ? "Phone must be at least 10 digits" : null),
    ],
  },
];

export function CustomerFormModal({ isOpen, onClose, onSubmit, initialData, isLoading }) {
  const { formData, setValue, reset, errors, validate, touched } = useForm(
    initialData || {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    }
  );

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate(customerValidation)) {
      await onSubmit(formData);
    }
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Customer" : "Create Customer"}
    >
      <form onSubmit={handleSubmit} className="grid gap-6">
        <TextInput
          name="name"
          label="Customer Name *"
          placeholder="Enter customer name"
          value={formData.name}
          onChange={setValue}
          error={errors.name}
          touched={touched.name}
          disabled={isLoading}
        />

        <TextInput
          name="email"
          label="Email *"
          type="email"
          placeholder="customer@example.com"
          value={formData.email}
          onChange={setValue}
          error={errors.email}
          touched={touched.email}
          disabled={isLoading}
        />

        <TextInput
          name="phone"
          label="Phone *"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={setValue}
          error={errors.phone}
          touched={touched.phone}
          disabled={isLoading}
        />

        <TextInput
          name="address"
          label="Address"
          placeholder="Street address"
          value={formData.address}
          onChange={setValue}
          disabled={isLoading}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            name="city"
            label="City"
            placeholder="City"
            value={formData.city}
            onChange={setValue}
            disabled={isLoading}
          />
          <TextInput
            name="state"
            label="State"
            placeholder="State"
            value={formData.state}
            onChange={setValue}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            name="zip"
            label="ZIP Code"
            placeholder="ZIP code"
            value={formData.zip}
            onChange={setValue}
            disabled={isLoading}
          />
          <TextInput
            name="country"
            label="Country"
            placeholder="Country"
            value={formData.country}
            onChange={setValue}
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3 border-t border-slate-200 pt-6 sm:flex-row-reverse">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Update" : "Create"} Customer
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </DetailModal>
  );
}
