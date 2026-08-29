import { useState, useCallback } from 'react';

export const useApi = (asyncFn, options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn(...args, options);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        if (options.onError) options.onError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn, options]
  );

  return { data, error, loading, execute };
};
