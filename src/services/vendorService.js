export const vendorService = {
  list: async (apiFetch) => {
    return apiFetch("/api/account/v1/vendors");
  },

  get: async (apiFetch, vendorId) => {
    return apiFetch(`/api/account/v1/vendors/${vendorId}`);
  },

  create: async (apiFetch, data) => {
    return apiFetch("/api/account/v1/vendors", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (apiFetch, vendorId, data) => {
    return apiFetch(`/api/account/v1/vendors/${vendorId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (apiFetch, vendorId) => {
    return apiFetch(`/api/account/v1/vendors/${vendorId}`, {
      method: "DELETE",
    });
  },

  activate: async (apiFetch, vendorId) => {
    return apiFetch(`/api/account/v1/vendors/${vendorId}/activate`, {
      method: "PUT",
    });
  },

  deactivate: async (apiFetch, vendorId) => {
    return apiFetch(`/api/account/v1/vendors/${vendorId}/deactivate`, {
      method: "PUT",
    });
  },
};
