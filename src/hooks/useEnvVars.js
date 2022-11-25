import { parseQueryString } from "utils";
import { useMemo } from "react";

const useEnvVars = () => {
  const { search } = window.location;

  const envVars = useMemo(() => {
    return parseQueryString(search);
  }, [search]);

  return [envVars];
};

export default useEnvVars;
