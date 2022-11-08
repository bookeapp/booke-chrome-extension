import Css from "./style.module.scss";

import { getPreloaderState } from "selectors";
import { useDispatch, useSelector } from "react-redux";
import Content from "./lib/Content";
import React, { useCallback, useEffect } from "react";
import Preloader from "lib/Preloader";
import authZeroApi from "api/AuthZeroApi";
import restApi from "api/RestApi";
import { uiSlice, userSlice } from "slices";

const App = () => {
  const dispatch = useDispatch();
  
  const loadInitialData = useCallback(async() => {
    const token = await authZeroApi.getAuthToken(); 
    if (token) {
      restApi.setToken(token);      
      const user = await authZeroApi.getUserInfo();      
      dispatch(userSlice.actions.setUserData(user));
    }
    dispatch(uiSlice.actions.togglePreloader(false));
  }, []);
  
  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <div className={Css.root}>
      <Content />
    </div>
  );
};

export default App;
