import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "../hooks/useForm";
import { DetailModal } from "./DetailModal";
import { TextInput, TextArea, SelectInput, NumberInput } from "./FormField";

const invoiceValidation = [
  {
    name: "invoiceNumber",
    rules: [
      (value) => (!value ? "Invoice number is required" : null),
    ],
  },
  {
    name: "customerId",
    rules: [
      (value) => (!value ? "Customer is required" : null),
    ],
  },
  {
    name: "amount",
    rules: [
      (value) => (!value ? "Amount is required" : null),
      (value) => (value && value <= 0 ? "Amount must be greater than 0" : null),
    ],
  },
  {
    name: "dueDate",
    rules: [
      (value) => (!value ? "Due date is required" : null),
    ],
  },
];

export function SalesInvoiceFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  customers = [],
}) {
  const { formData, setValue, reset, errors, validate, touched } = useForm(
    initialData || {
      invoiceNumber: "",
      customerId: "",
      amount: "",
      dueDate: "",
      description: "",
      notes: "",
    }
  );

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate(invoiceValidation)) {
      await onSubmit(formData);
    }
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Sales Invoice" : "Create Sales Invoice"}
    >
      <form onSubmit={handleSubmit} className="grid gap-6">
        <TextInput
          name="invoiceNumber"
          label="Invoice Number *"
          placeholder="e.g., INV-001"
          value={formData.invoiceNumber}
          onChange={setValue}
          error={errors.invoiceNumber}
          touched={touched.invoiceNumber}
          disabled={isLoading || !!initialData}
        />

        <SelectInput
          name="customerId"
          label="Customer *"
          placeholder="Select a customer"
          options={customers.map((c) => ({ value: c.id, label: c.name }))}
          value={formData.customerId}
          onChange={setValue}
          error={errors.customerId}
          touched={touched.customerId}
          disabled={isLoading}
        />

        <NumberInput
          name="amount"
          label="Amount *"
          placeholder="Enter amount"
          value={formData.amount}
          onChange={setValue}
          error={errors.amount}
          touched={touched.amount}
          disabled={isLoading}
        />

        <TextInput
          name="dueDate"
          label="Due Date *"
          type="date"
          value={formData.dueDate}
          onChange={setValue}
          error={errors.dueDate}
          touched={touched.dueDate}
          disabled={isLoading}
        />

        <TextInput
          name="description"
          label="Description"
          placeholder="Invoice description"
          value={formData.description}
          onChange={setValue}
          disabled={isLoading}
        />

        <TextArea
          name="notes"
          label="Notes"
          placeholder="Additional notes"
          value={formData.notes}
          onChange={setValue}
          disabled={isLoading}
          rows={3}
        />

        <div className="flex gap-3 border-t border-slate-200 pt-6 sm:flex-row-reverse">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Update" : "Create"} Invoice
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
