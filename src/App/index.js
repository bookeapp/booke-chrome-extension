import Css from "./style.module.scss";

import { VIEWS } from "const/Constants";
import { fetchStats, uiSlice, userSlice } from "slices";
import { log } from "utils";
import { useDispatch } from "react-redux";
import Content from "./lib/Content";
import React, { useCallback, useEffect } from "react";
import authZeroApi from "api/AuthZeroApi";
import restApi from "api/RestApi";

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

  const loadInitialData = useCallback(async() => {
    const token = await authZeroApi.getAuthToken();

    log({ token: !!token });

    if (token) {
      restApi.setToken(token);

      const user = await authZeroApi.getUserInfo();

      dispatch(userSlice.actions.setUserData(user));

      const shortCode = getShortCode();

      log({ shortCode });

      if (shortCode) {
        await dispatch(fetchStats(shortCode));
        dispatch(uiSlice.actions.setCurrentView(VIEWS.DASHBOARD));
      }
    }
    dispatch(uiSlice.actions.togglePreloader(false));
  }, [dispatch]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <div className={Css.root}>
      <Content />
    </div>
  );
};

export default App;
