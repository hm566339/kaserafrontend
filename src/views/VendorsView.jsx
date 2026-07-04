import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useApi, useData, useModal, useConfirm } from "../hooks";
import { vendorService } from "../services/vendorService";
import { DataTable } from "../components/DataTable";
import { VendorFormModal } from "../components/VendorFormModal";
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

export function VendorsView() {
  const { apiFetch, showToast } = useApi();
  const { data, loading, load, create, update, remove, action } = useData(() =>
    vendorService.list(apiFetch)
  );
  const { modal, open, close } = useModal();
  const { confirm, request, handleConfirm } = useConfirm();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreateVendor = async (formData) => {
    try {
      await create((apiFetch) => vendorService.create(apiFetch, formData), formData);
      close();
    } catch (err) {
      console.error("[v0] Create vendor error:", err);
    }
  };

  const handleUpdateVendor = async (formData) => {
    try {
      await update(
        (apiFetch, id, data) => vendorService.update(apiFetch, id, data),
        selectedVendor.id,
        formData
      );
      close();
      setSelectedVendor(null);
    } catch (err) {
      console.error("[v0] Update vendor error:", err);
    }
  };

  const handleDeleteVendor = (vendor) => {
    request(
      "Delete Vendor",
      `Are you sure you want to delete "${vendor.name}"? This action cannot be undone.`,
      async () => {
        try {
          await remove((apiFetch, id) => vendorService.delete(apiFetch, id), vendor.id);
          setSelectedVendor(null);
        } catch (err) {
          console.error("[v0] Delete vendor error:", err);
        }
      },
      true
    );
  };

  const handleActivateVendor = async (vendor) => {
    setActionLoading(true);
    try {
      await action((apiFetch, id) => vendorService.activate(apiFetch, id), vendor.id);
      showToast("Vendor activated successfully", "success");
    } catch (err) {
      console.error("[v0] Activate vendor error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateVendor = async (vendor) => {
    setActionLoading(true);
    try {
      await action(
        (apiFetch, id) => vendorService.deactivate(apiFetch, id),
        vendor.id
      );
      showToast("Vendor deactivated successfully", "success");
    } catch (err) {
      console.error("[v0] Deactivate vendor error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vendors</h1>
          <p className="text-sm text-slate-600 mt-1">Manage your vendor list</p>
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
              setSelectedVendor(null);
              open("create-vendor");
            }}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <Plus size={16} />
            New Vendor
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onRowClick={(vendor) => {
          setSelectedVendor(vendor);
          open("view-vendor", vendor);
        }}
        onEdit={(vendor) => {
          setSelectedVendor(vendor);
          open("edit-vendor", vendor);
        }}
        onDelete={handleDeleteVendor}
      />

      <VendorFormModal
        isOpen={modal?.type === "create-vendor"}
        onClose={close}
        onSubmit={handleCreateVendor}
        isLoading={loading}
      />

      <VendorFormModal
        isOpen={modal?.type === "edit-vendor"}
        onClose={close}
        onSubmit={handleUpdateVendor}
        initialData={selectedVendor}
        isLoading={loading}
      />

      {modal?.type === "view-vendor" && selectedVendor && (
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
                <h2 className="text-lg font-semibold text-slate-900">Vendor Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Name</p>
                    <p className="text-sm text-slate-900">{selectedVendor.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Email</p>
                    <p className="text-sm text-slate-900">{selectedVendor.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Phone</p>
                    <p className="text-sm text-slate-900">{selectedVendor.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Status</p>
                    <p className="text-sm text-slate-900">{selectedVendor.status || "Inactive"}</p>
                  </div>
                </div>
                {selectedVendor.address && (
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Address</p>
                    <p className="text-sm text-slate-900">{selectedVendor.address}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 border-t border-slate-200 p-6 sm:flex-row-reverse">
                <button
                  onClick={() => {
                    setSelectedVendor(selectedVendor);
                    open("edit-vendor", selectedVendor);
                  }}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    selectedVendor.status === "active"
                      ? handleDeactivateVendor(selectedVendor)
                      : handleActivateVendor(selectedVendor)
                  }
                  disabled={actionLoading}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  {selectedVendor.status === "active" ? "Deactivate" : "Activate"}
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
