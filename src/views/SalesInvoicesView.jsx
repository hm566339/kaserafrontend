import { useEffect, useState } from "react";
import { Plus, RefreshCw, CheckCircle2, XCircle, Send } from "lucide-react";
import { useApi, useData, useModal, useConfirm } from "../hooks";
import { salesInvoiceService } from "../services/salesInvoiceService";
import { customerService } from "../services/customerService";
import { DataTable } from "../components/DataTable";
import { SalesInvoiceFormModal } from "../components/SalesInvoiceFormModal";
import { ConfirmModal } from "../components/ConfirmModal";

const columns = [
  { key: "invoiceNumber", label: "Invoice #" },
  { key: "customerId", label: "Customer" },
  {
    key: "amount",
    label: "Amount",
    render: (row) => `$${(row.amount || 0).toFixed(2)}`,
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
          row.status === "approved"
            ? "bg-green-100 text-green-700"
            : row.status === "rejected"
            ? "bg-red-100 text-red-700"
            : row.status === "posted"
            ? "bg-blue-100 text-blue-700"
            : row.status === "paid"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        }`}
      >
        {row.status || "draft"}
      </span>
    ),
  },
  { key: "dueDate", label: "Due Date" },
];

export function SalesInvoicesView() {
  const { apiFetch, showToast } = useApi();
  const { data, loading, load, create, update, remove, action } = useData(() =>
    salesInvoiceService.list(apiFetch)
  );
  const { data: customers, load: loadCustomers } = useData(() =>
    customerService.list(apiFetch)
  );
  const { modal, open, close } = useModal();
  const { confirm, request, handleConfirm } = useConfirm();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    load();
    loadCustomers();
  }, [load, loadCustomers]);

  const handleCreateInvoice = async (formData) => {
    try {
      await create(
        (apiFetch) => salesInvoiceService.create(apiFetch, formData),
        formData
      );
      close();
    } catch (err) {
      console.error("[v0] Create invoice error:", err);
    }
  };

  const handleUpdateInvoice = async (formData) => {
    try {
      await update(
        (apiFetch, id, data) => salesInvoiceService.update(apiFetch, id, data),
        selectedInvoice.id,
        formData
      );
      close();
      setSelectedInvoice(null);
    } catch (err) {
      console.error("[v0] Update invoice error:", err);
    }
  };

  const handleDeleteInvoice = (invoice) => {
    request(
      "Delete Invoice",
      `Are you sure you want to delete invoice "${invoice.invoiceNumber}"? This action cannot be undone.`,
      async () => {
        try {
          await remove(
            (apiFetch, id) => salesInvoiceService.delete(apiFetch, id),
            invoice.id
          );
          setSelectedInvoice(null);
        } catch (err) {
          console.error("[v0] Delete invoice error:", err);
        }
      },
      true
    );
  };

  const performAction = async (action, actionFn, successMessage) => {
    setActionLoading(true);
    try {
      await action(actionFn, selectedInvoice.id);
      showToast(successMessage, "success");
    } catch (err) {
      console.error("[v0] Action error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales Invoices</h1>
          <p className="text-sm text-slate-600 mt-1">Manage and track your sales invoices</p>
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
              setSelectedInvoice(null);
              open("create-invoice");
            }}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <Plus size={16} />
            New Invoice
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onRowClick={(invoice) => {
          setSelectedInvoice(invoice);
          open("view-invoice", invoice);
        }}
        onEdit={(invoice) => {
          setSelectedInvoice(invoice);
          open("edit-invoice", invoice);
        }}
        onDelete={handleDeleteInvoice}
      />

      <SalesInvoiceFormModal
        isOpen={modal?.type === "create-invoice"}
        onClose={close}
        onSubmit={handleCreateInvoice}
        isLoading={loading}
        customers={customers}
      />

      <SalesInvoiceFormModal
        isOpen={modal?.type === "edit-invoice"}
        onClose={close}
        onSubmit={handleUpdateInvoice}
        initialData={selectedInvoice}
        isLoading={loading}
        customers={customers}
      />

      {modal?.type === "view-invoice" && selectedInvoice && (
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
                <h2 className="text-lg font-semibold text-slate-900">Invoice Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Invoice #</p>
                    <p className="text-sm text-slate-900">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Status</p>
                    <p className="text-sm text-slate-900">{selectedInvoice.status || "Draft"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Amount</p>
                    <p className="text-sm text-slate-900">${(selectedInvoice.amount || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 uppercase">Due Date</p>
                    <p className="text-sm text-slate-900">{selectedInvoice.dueDate}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 border-t border-slate-200 p-6 flex-wrap">
                {selectedInvoice.status !== "approved" && (
                  <button
                    onClick={() =>
                      performAction(
                        action,
                        (apiFetch, id) => salesInvoiceService.approve(apiFetch, id),
                        "Invoice approved successfully"
                      )
                    }
                    disabled={actionLoading}
                    className="flex items-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    Approve
                  </button>
                )}
                {selectedInvoice.status === "approved" && selectedInvoice.status !== "posted" && (
                  <button
                    onClick={() =>
                      performAction(
                        action,
                        (apiFetch, id) => salesInvoiceService.post(apiFetch, id),
                        "Invoice posted successfully"
                      )
                    }
                    disabled={actionLoading}
                    className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50"
                  >
                    <Send size={16} />
                    Post
                  </button>
                )}
                {selectedInvoice.status !== "paid" && selectedInvoice.status === "posted" && (
                  <button
                    onClick={() =>
                      performAction(
                        action,
                        (apiFetch, id) => salesInvoiceService.markPaid(apiFetch, id),
                        "Invoice marked as paid"
                      )
                    }
                    disabled={actionLoading}
                    className="flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-200 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    Mark Paid
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedInvoice(selectedInvoice);
                    open("edit-invoice", selectedInvoice);
                  }}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Edit
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
