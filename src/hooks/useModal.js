import { useCallback, useState } from "react";

export const useModal = () => {
  const [modal, setModal] = useState(null);

  const open = useCallback(
    (type, data = null) => {
      setModal({ type, data });
    },
    []
  );

  const close = useCallback(() => {
    setModal(null);
  }, []);

  const replace = useCallback(
    (type, data = null) => {
      setModal({ type, data });
    },
    []
  );

  return { modal, open, close, replace };
};
