import Css from "./style.module.scss";

import { BOTTOM_INDENT, VIEWS, XERO_HEADER_HEIGHT } from "const/Constants";
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
    const position = positionY + event.clientY - dragStart;

    setPositionY(
      Math.min(
        window.innerHeight - BOTTOM_INDENT,
        Math.max(position, XERO_HEADER_HEIGHT)
      )
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragStart]);

  const handleWindowMouseUp = useCallback((event) => {
    setDragStart(false);

    const draggedDistantion = event.clientY - dragStart;

    if (draggedDistantion === 0) {
      handleButtonClick();
    } else {
      const position = positionY + draggedDistantion;

      dispatch(uiSlice.actions.setPositionY(
        Math.min(
          window.innerHeight - BOTTOM_INDENT,
          Math.max(position, XERO_HEADER_HEIGHT)
        )
      ));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
