export const customerService = {
  list: async (apiFetch) => {
    return apiFetch("/api/account/v1/customers");
  },

  get: async (apiFetch, customerId) => {
    return apiFetch(`/api/account/v1/customers/${customerId}`);
  },

  create: async (apiFetch, data) => {
    return apiFetch("/api/account/v1/customers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (apiFetch, customerId, data) => {
    return apiFetch(`/api/account/v1/customers/${customerId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (apiFetch, customerId) => {
    return apiFetch(`/api/account/v1/customers/${customerId}`, {
      method: "DELETE",
    });
  },

  activate: async (apiFetch, customerId) => {
    return apiFetch(`/api/account/v1/customers/${customerId}/activate`, {
      method: "PUT",
    });
  },

  deactivate: async (apiFetch, customerId) => {
    return apiFetch(`/api/account/v1/customers/${customerId}/deactivate`, {
      method: "PUT",
    });
  },
};
