import { useCallback, useState } from "react";

export const useConfirm = () => {
  const [confirm, setConfirm] = useState(null);

  const request = useCallback(
    (title, message, onConfirm, danger = false) => {
      setConfirm({
        title,
        message,
        onConfirm,
        danger,
      });
    },
    []
  );

  const close = useCallback(() => {
    setConfirm(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (confirm?.onConfirm) {
      await confirm.onConfirm();
    }
    close();
  }, [confirm, close]);

  return { confirm, request, close, handleConfirm };
};
