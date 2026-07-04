export const apInvoiceService = {
  list: async (apiFetch) => {
    return apiFetch("/api/account/ap-invoices");
  },

  get: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/ap-invoices/${invoiceId}`);
  },

  create: async (apiFetch, data) => {
    return apiFetch("/api/account/ap-invoices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (apiFetch, invoiceId, data) => {
    return apiFetch(`/api/account/ap-invoices/${invoiceId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/ap-invoices/${invoiceId}`, {
      method: "DELETE",
    });
  },

  approve: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/ap-invoices/${invoiceId}/approve`, {
      method: "PUT",
    });
  },

  reject: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/ap-invoices/${invoiceId}/reject`, {
      method: "PUT",
    });
  },

  post: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/ap-invoices/${invoiceId}/post`, {
      method: "PUT",
    });
  },

  markPaid: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/ap-invoices/${invoiceId}/mark-paid`, {
      method: "PUT",
    });
  },

  partialPayment: async (apiFetch, invoiceId, data) => {
    return apiFetch(`/api/account/ap-invoices/${invoiceId}/partial-payment`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  cancel: async (apiFetch, invoiceId) => {
    return apiFetch(`/api/account/ap-invoices/${invoiceId}/cancel`, {
      method: "PUT",
    });
  },
};
