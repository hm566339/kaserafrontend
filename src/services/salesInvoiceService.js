export const salesInvoiceService = {
  list: async (apiFetch) => {
    return apiFetch("/api/account/sales/invoices");
  },

  get: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/sales/invoices/${invoiceId}`);
  },

  create: async (apiFetch, data) => {
    return apiFetch("/api/account/sales/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (apiFetch, invoiceId, data) => {
    return apiFetch(`/api/account/sales/invoices/${invoiceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/sales/invoices/${invoiceId}`, {
      method: "DELETE",
    });
  },

  approve: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/sales/invoices/${invoiceId}/approve`, {
      method: "PUT",
    });
  },

  reject: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/sales/invoices/${invoiceId}/reject`, {
      method: "PUT",
    });
  },

  post: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/sales/invoices/${invoiceId}/post`, {
      method: "PUT",
    });
  },

  markPaid: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/sales/invoices/${invoiceId}/mark-paid`, {
      method: "PUT",
    });
  },

  partialPayment: async (apiFetch, invoiceId, data) => {
    return apiFetch(`/api/account/sales/invoices/${invoiceId}/partial-payment`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  cancel: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/sales/invoices/${invoiceId}/cancel`, {
      method: "PUT",
    });
  },

  addTax: async (apiFetch, invoiceId, data) => {
    return apiFetch(`/api/account/sales/invoices/${invoiceId}/taxes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateTax: async (apiFetch, invoiceId, taxId, data) => {
    return apiFetch(`/api/account/sales/invoices/${invoiceId}/taxes/${taxId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteTax: async (apiFetch, invoiceId, taxId) => {
    return apiFetch(`/api/account/sales/invoices/${invoiceId}/taxes/${taxId}`, {
      method: "DELETE",
    });
  },
};
