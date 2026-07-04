import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useApi, useData, useModal, useConfirm } from "../hooks";
import { customerService } from "../services/customerService";
import { DataTable } from "../components/DataTable";
import { CustomerFormModal } from "../components/CustomerFormModal";
import { ConfirmModal } from "../components/ConfirmModal";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "city", label: "City" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
          row.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-slate-100 text-slate-700"
        }`}
      >
        {row.status || "inactive"}
      </span>
    ),
  },
];

export function CustomersView() {
  const { apiFetch, showToast } = useApi();
  const { data, loading, load, create, update, remove, action } = useData(() =>
    customerService.list(apiFetch)
  );
  const { modal, open, close } = useModal();
  const { confirm, request, handleConfirm } = useConfirm();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreateCustomer = async (formData) => {
    try {
      await create((apiFetch) => customerService.create(apiFetch, formData), formData);
      close();
    } catch (err) {
      console.error("[v0] Create customer error:", err);
    }
  };

  const handleUpdateCustomer = async (formData) => {
    try {
      await update(
        (apiFetch, id, data) => customerService.update(apiFetch, id, data),
        selectedCustomer.id,
        formData
      );
      close();
      setSelectedCustomer(null);
    } catch (err) {
      console.error("[v0] Update customer error:", err);
    }
  };

  const handleDeleteCustomer = (customer) => {
    request(
      "Delete Customer",
      `Are you sure you want to delete "${customer.name}"? This action cannot be undone.`,
      async () => {
        try {
          await remove((apiFetch, id) => customerService.delete(apiFetch, id), customer.id);
          setSelectedCustomer(null);
        } catch (err) {
          console.error("[v0] Delete customer error:", err);
        }
      },
      true
    );
  };

  const handleActivateCustomer = async (customer) => {
    setActionLoading(true);
    try {
      await action((apiFetch, id) => customerService.activate(apiFetch, id), customer.id);
      showToast("Customer activated successfully", "success");
    } catch (err) {
      console.error("[v0] Activate customer error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateCustomer = async (customer) => {
    setActionLoading(true);
    try {
      await action(
        (apiFetch, id) => customerService.deactivate(apiFetch, id),
        customer.id
      );
      showToast("Customer deactivated successfully", "success");
    } catch (err) {
      console.error("[v0] Deactivate customer error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="text-sm text-slate-600 mt-1">Manage your customer list</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => load()}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => {
              setSelectedCustomer(null);
              open("create-customer");
            }}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <Plus size={16} />
            New Customer
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onRowClick={(customer) => {
          setSelectedCustomer(customer);
          open("view-customer", customer);
        }}
        onEdit={(customer) => {
          setSelectedCustomer(customer);
          open("edit-customer", customer);
        }}
        onDelete={handleDeleteCustomer}
      />

      <CustomerFormModal
        isOpen={modal?.type === "create-customer"}
        onClose={close}
        onSubmit={handleCreateCustomer}
        isLoading={loading}
      />

      <CustomerFormModal
        isOpen={modal?.type === "edit-customer"}
        onClose={close}
        onSubmit={handleUpdateCustomer}
        initialData={selectedCustomer}
        isLoading={loading}
      />

      {modal?.type === "view-customer" && selectedCustomer && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Customer Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Name</p>
                    <p className="text-sm text-slate-900">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Email</p>
                    <p className="text-sm text-slate-900">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Phone</p>
                    <p className="text-sm text-slate-900">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Status</p>
                    <p className="text-sm text-slate-900">{selectedCustomer.status || "Inactive"}</p>
                  </div>
                </div>
                {selectedCustomer.address && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Address</p>
                    <p className="text-sm text-slate-900">{selectedCustomer.address}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 border-t border-slate-200 p-6 sm:flex-row-reverse">
                <button
                  onClick={() => {
                    setSelectedCustomer(selectedCustomer);
                    open("edit-customer", selectedCustomer);
                  }}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    selectedCustomer.status === "active"
                      ? handleDeactivateCustomer(selectedCustomer)
                      : handleActivateCustomer(selectedCustomer)
                  }
                  disabled={actionLoading}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  {selectedCustomer.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={close}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirm}
        onClose={() => request(null)}
        onConfirm={handleConfirm}
        title={confirm?.title}
        message={confirm?.message}
        danger={confirm?.danger}
        isLoading={loading}
      />
    </div>
  );
}
