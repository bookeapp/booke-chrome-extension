import Css from "./style.module.scss";

import { VIEWS } from "const/Constants";
import { getPositionY, getPreloaderState, getUserData } from "selectors";
import { uiSlice } from "slices";
import { useDispatch, useSelector } from "react-redux";
import AuthZeroApi from "api/AuthZeroApi";
import Logo from "./lib/Logo";
import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";

const Main = () => {
  const dispatch = useDispatch();

  const preloaderShown = useSelector(getPreloaderState);

  const initialPositionY = useSelector(getPositionY);

  console.log(">>> ", { initialPositionY });

  const userData = useSelector(getUserData);

  const [dragStart, setDragStart] = useState(false);

  const [positionY, setPositionY] = useState(initialPositionY);

  const dragged = !!dragStart;

  const handleButtonClick = useCallback(() => {
    if (preloaderShown) return;
    if (userData) {
      dispatch(uiSlice.actions.setCurrentView(VIEWS.DASHBOARD));
    } else {
      AuthZeroApi.loginWithRedirect();
    }
  }, [dispatch, preloaderShown, userData]);

  const handleMouseDown = useCallback((event) => {
    setDragStart(event.clientY);
  }, []);

  const handleWindowMouseMove = useCallback((event) => {
    setPositionY(positionY + event.clientY - dragStart);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragStart]);

  const handleWindowMouseUp = useCallback((event) => {
    setDragStart(false);
    if ((event.clientY - dragStart) === 0) {
      handleButtonClick();
    } else {
      dispatch(uiSlice.actions.setPositionY(event.clientY - dragStart));
    }
  }, [dragStart, dispatch, handleButtonClick]);

  useEffect(() => {
    if (dragged) {
      window.addEventListener("mouseup", handleWindowMouseUp);
      window.addEventListener("mousemove", handleWindowMouseMove);

      return () => {
        window.removeEventListener("mouseup", handleWindowMouseUp);
        window.removeEventListener("mousemove", handleWindowMouseMove);
      };
    }

    return () => {};
  }, [dragged, handleWindowMouseMove, handleWindowMouseUp]);

  return (
    <div
      className={classNames(Css.main, preloaderShown && Css.preloaderShown)}
      style={{ top: positionY ? `${positionY}px` : "50%" }}
      onMouseDown={handleMouseDown}>
      <Logo />
    </div>
  );
};

export default Main;
