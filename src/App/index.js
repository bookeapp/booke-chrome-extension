import Css from "./style.module.scss";

import { API_CHECK_INTERVAL } from "const/Constants";
import { fetchStats, uiSlice, userSlice } from "slices";
import { getCurrentShortCode } from "selectors";
import { log } from "utils";
import { useDispatch, useSelector } from "react-redux";
import Content from "./lib/Content";
import React, { useCallback, useEffect, useState } from "react";
import api from "api/Api";
import authZeroApi from "api/AuthZeroApi";

const getShortCode = () => {
  try {
    const scriptNode = document.querySelector("#header-data");

    if (scriptNode) {
      const data = JSON.parse(scriptNode.textContent);

      const code = (data.substitutions || {}).organisationShortCodeToken;

      if (code) return code;
    }

    const [,, part] = window.location.pathname.split("/");

    if (/^!\w{3,7}$/.test(part)) return part;
  } catch (exeption) {}

  return null;
};

const App = () => {
  const dispatch = useDispatch();

  const currentShortCode = useSelector(getCurrentShortCode);

  const [token, setToken] = useState(null);

  useEffect(() => {
    const shortCode = getShortCode();

    log({ shortCode });

    if (shortCode) dispatch(uiSlice.actions.setCurrentShortCode(shortCode));
  }, [dispatch]);

  const loadInitialData = useCallback(async() => {
    api.setToken(token);

    setInterval(() => {
      dispatch(fetchStats(currentShortCode));
    }, [API_CHECK_INTERVAL]);

    await dispatch(fetchStats(currentShortCode));

    dispatch(uiSlice.actions.togglePreloader(false));
  }, [token, currentShortCode, dispatch]);

  useEffect(() => {
    (async() => {
      const result = await authZeroApi.getAuthToken();

      if (result) {
        setToken(result);

        const userData = await authZeroApi.getUserInfo();

        dispatch(userSlice.actions.setUserData(userData));
      } else {
        dispatch(uiSlice.actions.togglePreloader(false));
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if (!token || !currentShortCode) return;

    log({ token: !!token });

    loadInitialData();
  }, [token, currentShortCode, loadInitialData]);

  if (!currentShortCode) return null;

  return (
    <div className={Css.root}>
      <Content />
    </div>
  );
};

export default App;
