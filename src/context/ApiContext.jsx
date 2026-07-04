import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => ({
    baseUrl: localStorage.getItem("accountErp.baseUrl") || "http://localhost:8081",
    token: localStorage.getItem("accountErp.token") || "",
    companyId: localStorage.getItem("accountErp.companyId") || "",
    userId: localStorage.getItem("accountErp.userId") || "",
  }));

  const [toasts, setToasts] = useState([]);

  const apiFetch = useCallback(
    async (path, options = {}) => {
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (settings.token) headers.Authorization = `Bearer ${settings.token}`;
      if (settings.companyId) headers["X-Company-Id"] = settings.companyId;
      if (settings.userId) headers["X-User-Id"] = settings.userId;

      const response = await fetch(`${settings.baseUrl.replace(/\/$/, "")}${path}`, {
        ...options,
        headers,
        credentials: "include",
      });

      const text = await response.text();
      const body = text ? JSON.parse(text) : null;

      if (!response.ok) {
        const errorMessage = body?.message || body?.error || `Request failed with ${response.status}`;
        throw new Error(errorMessage);
      }

      return body;
    },
    [settings]
  );

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("accountErp.baseUrl", newSettings.baseUrl);
    localStorage.setItem("accountErp.token", newSettings.token);
    localStorage.setItem("accountErp.companyId", newSettings.companyId);
    localStorage.setItem("accountErp.userId", newSettings.userId);
  }, []);

  return (
    <ApiContext.Provider value={{ settings, updateSettings, apiFetch, showToast, dismissToast, toasts }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within ApiProvider");
  }
  return context;
};
