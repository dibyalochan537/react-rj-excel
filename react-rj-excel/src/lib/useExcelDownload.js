import { useState, useCallback } from "react";
import { downloadExcel } from "./downloadExcel.js";

export function useExcelDownload({ onSuccess, onError } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // `options` can be an object, or a function (sync/async) that returns the object
  const download = useCallback(
    async (options) => {
      setLoading(true);
      setError(null);
      try {
        const resolved = typeof options === "function" ? await options() : options;
        await downloadExcel(resolved);
        onSuccess?.();
      } catch (e) {
        setError(e);
        if (onError) onError(e);
        else console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

  return { download, loading, error };
}