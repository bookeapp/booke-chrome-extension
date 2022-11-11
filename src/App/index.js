import Css from "./style.module.scss";

import { fetchStats, uiSlice, userSlice } from "slices";
import { log } from "utils";
import { useDispatch } from "react-redux";
import Content from "./lib/Content";
import React, { useCallback, useEffect, useMemo } from "react";
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

  const shortCode = useMemo(() => {
    return getShortCode();
  }, []);

  log({ shortCode });

  const loadInitialData = useCallback(async() => {
    if (!shortCode) return;

    const token = await authZeroApi.getAuthToken();

    log({ token: !!token });

    if (token) {
      api.setToken(token);

      const user = await authZeroApi.getUserInfo();

      dispatch(userSlice.actions.setUserData(user));

      if (shortCode) {
        await dispatch(fetchStats(shortCode));
      }
    }
    dispatch(uiSlice.actions.togglePreloader(false));
  }, [dispatch, shortCode]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  if (!shortCode) return null;

  return (
    <div className={Css.root}>
      <Content />
    </div>
  );
};

export default App;
