import Css from "./style.module.scss";

import { VIEWS } from "const/Constants";
import { getPreloaderState, getUserData } from "selectors";
import { uiSlice } from "slices";
import { useDispatch, useSelector } from "react-redux";
import AuthZeroApi from "api/AuthZeroApi";
import Logo from "./lib/Logo";
import React, { useCallback } from "react";
import classNames from "classnames";

const Main = () => {
  const dispatch = useDispatch();

  const preloaderShown = useSelector(getPreloaderState);

  const userData = useSelector(getUserData);

  const handleButtonClick = useCallback(() => {
    if (preloaderShown) return;
    if (userData) {
      dispatch(uiSlice.actions.setCurrentView(VIEWS.DASHBOARD));
    } else {
      AuthZeroApi.loginWithRedirect();
    }
  }, [dispatch, preloaderShown, userData]);

  return (
    <div
      className={classNames(Css.main, preloaderShown && Css.preloaderShown)}
      onClick={handleButtonClick}>
      <Logo />
    </div>
  );
};

export default Main;
