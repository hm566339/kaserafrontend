import { useCallback, useState } from "react";
import { useApi } from "../context/ApiContext";

export const useData = (fetchFn) => {
  const { apiFetch, showToast } = useApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(apiFetch);
      setData(Array.isArray(result) ? result : result?.data || []);
    } catch (err) {
      const message = err.message || "Failed to load data";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }, [apiFetch, fetchFn, showToast]);

  const create = useCallback(
    async (createFn, itemData) => {
      setLoading(true);
      try {
        const newItem = await createFn(apiFetch, itemData);
        setData((prev) => [...prev, newItem]);
        showToast("Created successfully", "success");
        return newItem;
      } catch (err) {
        const message = err.message || "Failed to create";
        setError(message);
        showToast(message, "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFetch, showToast]
  );

  const update = useCallback(
    async (updateFn, id, itemData) => {
      setLoading(true);
      try {
        const updated = await updateFn(apiFetch, id, itemData);
        setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
        showToast("Updated successfully", "success");
        return updated;
      } catch (err) {
        const message = err.message || "Failed to update";
        setError(message);
        showToast(message, "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFetch, showToast]
  );

  const remove = useCallback(
    async (deleteFn, id) => {
      setLoading(true);
      try {
        await deleteFn(apiFetch, id);
        setData((prev) => prev.filter((item) => item.id !== id));
        showToast("Deleted successfully", "success");
      } catch (err) {
        const message = err.message || "Failed to delete";
        setError(message);
        showToast(message, "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFetch, showToast]
  );

  const action = useCallback(
    async (actionFn, id, actionData = null) => {
      setLoading(true);
      try {
        const result = await (actionData ? actionFn(apiFetch, id, actionData) : actionFn(apiFetch, id));
        setData((prev) => prev.map((item) => (item.id === id ? { ...item, ...result } : item)));
        return result;
      } catch (err) {
        const message = err.message || "Failed to perform action";
        setError(message);
        showToast(message, "error");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFetch, showToast]
  );

  return { data, loading, error, load, create, update, remove, action, setData };
};
