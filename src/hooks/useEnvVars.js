import { objectToQueryString, parseQueryString } from "utils";
import { useCallback, useMemo } from "react";

const useEnvVars = () => {
  const { search } = window.location;

  const envVars = useMemo(() => {
    return parseQueryString(search);
  }, [search]);

  const setEnvVars = useCallback((newValues) => {
    window.location.search = objectToQueryString({ ...envVars, ...newValues });
  }, [envVars]);

  return [envVars, setEnvVars];
};

export default useEnvVars;
