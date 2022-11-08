import Css from "./style.module.scss";

import { fetchStats, uiSlice, userSlice } from "slices";
import { log } from "utils";
import { useDispatch } from "react-redux";
import Content from "./lib/Content";
import React, { useCallback, useEffect } from "react";
import authZeroApi from "api/AuthZeroApi";
import restApi from "api/RestApi";

const App = () => {
  const dispatch = useDispatch();

  const loadInitialData = useCallback(async() => {
    const token = await authZeroApi.getAuthToken();

    log({ token: !!token });

    if (token) {
      restApi.setToken(token);

      const user = await authZeroApi.getUserInfo();

      dispatch(userSlice.actions.setUserData(user));

      const [,, shortcode = "!RwTcn"] = window.location.pathname.split("/");

      log({ shortcode });

      // dispatch(fetchStats(shortcode));
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
