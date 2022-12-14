import { GOOGLE_ID, STORAGE_NAME } from "const/Constants";

export const setTimeout = (callback, interval, ...restArgs) => {
  const timeoutId = window.setTimeout(callback, interval, ...restArgs);

  return () => clearTimeout(timeoutId);
};

export const setInterval = (callback, interval, ...restArgs) => {
  const intervalId = window.setInterval(callback, interval, ...restArgs);

  return () => clearInterval(intervalId);
};

export const parseQueryString = (query) => {
  return (query || "").replace(/^\?/, "").split("&").reduce((envVars, keyValuePair) => {
    let [key, value] = keyValuePair.split("=");

    if (value === "null") value = null;
    else if (value === "false") value = false;
    else value = value === undefined ? true : decodeURIComponent(value);
    envVars[key] = value;

    return envVars;
  }, {});
};

export const objectToQueryString = (paramObj, withoutUrlEncode = false) => {
  if (!paramObj) return "";

  return Object.keys(paramObj).map((key) => {
    const values = paramObj[key];

    if (!key || values === undefined || values === null) return null;

    return (Array.isArray(values) ? values : [values]).map((value) => {
      return `${withoutUrlEncode ? key : encodeURIComponent(key)}${
        value === true ? "" : `=${(withoutUrlEncode ? value : encodeURIComponent(value))}`}`;
    });
  }).filter(Boolean).join("&");
};

export const storageValue = (key, value, useSessionStorage = false) => {
  const storage = useSessionStorage ? window.sessionStorage : window.localStorage;

  try {
    if (value === null) {
      storage.removeItem(key);

      return null;
    }
    if (value !== undefined) {
      storage.setItem(key, value);

      return value;
    }

    return storage.getItem(key);
  } catch (error) {
    return null;
  }
};

export const arrayUpdateItem = (array, uniqKey, uniqKeyValue, update) => {
  const updateFunction = typeof update === "function" ? update : () => update;

  return array && array.map((item) => (item[uniqKey] === uniqKeyValue ? updateFunction(item) : item));
};

export const arrayUpdateItemById = (array, id, update) => {
  return arrayUpdateItem(array, "id", id, update);
};

export const arrayFind = (array, uniqKey, uniqKeyValue, fallback) => {
  return (array && array.find((item) => item[uniqKey] === uniqKeyValue)) || fallback;
};

export const arrayFindById = (array, id, fallback) => {
  return Array.isArray(array) && arrayFind(array, "id", id, fallback);
};

export const arraySort = (array, props, orders) => {
  if (!array) return array;

  const sortProps = Array.isArray(props) ? props : [props];

  const sortOrders = Array.isArray(orders) ? orders : [orders];

  return [...array].sort((elA, elB) => {
    return sortProps.reduce((result, current, index) => {
      if (result) return result;

      const typeFunction = typeof current === "function";

      const [propA, propB] = typeFunction
        ? [current(elA), current(elB)]
        : [elA[current], elB[current]];

      if (propA < propB) {
        return sortOrders[index] ? -1 : 1;
      }

      if (propA > propB) {
        return sortOrders[index] ? 1 : -1;
      }

      return 0;
    }, 0);
  });
};

export const normalizeId = (id) => {
  return (id || "").replaceAll("-", "").toUpperCase();
};

export const getStoreData = () => {
  try {
    return JSON.parse(storageValue(STORAGE_NAME) || "{}");
  } catch (exeption) {}

  return {};
};

export const setStoreData = (data) => {
  const stored = getStoreData();

  storageValue(STORAGE_NAME, JSON.stringify({ ...stored, ...data }));
};

export const log = getStoreData().debug ? (...args) => {
  // eslint-disable-next-line no-console
  console.log("%c%s", "color: #ff0", "[BOOKE.AI]", ...args);
} : () => {};

export const runInSequence = async(tasks) => {
  const result = await tasks.reduce(
    (promiseChain, currentTask) => {
      return promiseChain.then((chainResults) => currentTask().then((currentResult) => [...chainResults, currentResult]));
    },
    Promise.resolve([])
  );

  return result;
};

export const delay = async(time) => {
  await new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export const loopWhile = async(task, condition = true) => {
  if (condition) {
    condition = await task();
    await loopWhile(task, condition);
  }
};

export const addGoogleAnalytic = () => {
  log("addGoogleAnalytic()");
  /* eslint-disable */
  try {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ID}`;
    window.dataLayer = window.dataLayer || [];
    window.gtag = () => {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", GOOGLE_ID);
  } catch (exception) {
    console.log("BOOKE.AI addGoogleAnalytic() exceptionm", exception);
  }
  /* eslint-enable */
};

export const gtagEvent = (type, params) => {
  try {
    window.gtag("event", type, params);
  } catch (exception) {
    // eslint-disable-next-line no-console
    console.log("BOOKE.AI gtagEvent() exceptionm", exception);
  }
};
