import Css from "./style.module.scss";

import { BOTTOM_INDENT, TOP_INDENT, VIEWS } from "const/Constants";
import { getBookeTransactions, getBusinessesData, getPositionY, getPreloaderState, getUserData } from "selectors";
import { getStoreData, setStoreData } from "utils";
import { uiSlice } from "slices";
import { useDispatch, useSelector } from "react-redux";
import Badge from "lib/Badge";
import Logo from "./lib/Logo";
import React, { useCallback, useEffect, useRef, useState } from "react";
import authZeroApi from "api/AuthZeroApi";
import classNames from "classnames";

const Main = ({ currentBusiness }) => {
  const dispatch = useDispatch();

  const preventClickRef = useRef();

  const preloaderShown = useSelector(getPreloaderState);

  const initialPositionY = useSelector(getPositionY);

  const userData = useSelector(getUserData);

  const bookeTransactions = useSelector(getBookeTransactions);

  const businessesData = useSelector(getBusinessesData);

  const [dragStart, setDragStart] = useState(false);

  const [positionY, setPositionY] = useState(initialPositionY);

  const dragged = !!dragStart;

  const notificationsCount = currentBusiness
    ? (bookeTransactions ? bookeTransactions.length : 0)
    : (businessesData ? businessesData.reduce((accum, { transactions }) => transactions + accum, 0) : 0);

  const handleButtonClick = useCallback((event) => {
    if (event.altKey) {
      const { debug } = getStoreData();

      if (event.shiftKey) {
        setStoreData({ debug: !debug });

        window.location.reload();

        return;
      }

      if (debug) {
        authZeroApi.logoutUser();

        return;
      }
    }

    if (preventClickRef.current) {
      preventClickRef.current = false;

      return;
    }
    if (preloaderShown) return;
    if (userData) {
      dispatch(uiSlice.actions.setCurrentView(VIEWS.DASHBOARD));
    } else {
      authZeroApi.loginWithRedirect();
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
        Math.max(position, TOP_INDENT)
      )
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragStart]);

  const handleWindowMouseUp = useCallback((event) => {
    setDragStart(false);

    const draggedDistantion = event.clientY - dragStart;

    if (draggedDistantion === 0) {
      preventClickRef.current = false;
    } else {
      preventClickRef.current = true;

      const position = positionY + draggedDistantion;

      dispatch(uiSlice.actions.setPositionY(
        Math.min(
          window.innerHeight - BOTTOM_INDENT,
          Math.max(position, TOP_INDENT)
        )
      ));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragStart, dispatch, handleButtonClick]);

  const handleWindowResize = useCallback(() => {
    const newPosition = Math.min(
      window.innerHeight - BOTTOM_INDENT,
      Math.max(positionY, TOP_INDENT)
    );

    setPositionY(newPosition);

    dispatch(uiSlice.actions.setPositionY(newPosition));
  }, [dispatch, positionY]);

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

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("orientationchange", handleWindowResize);
    window.addEventListener("fullscreenchange", handleWindowResize);

    handleWindowResize();

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("orientationchange", handleWindowResize);
      window.removeEventListener("fullscreenchange", handleWindowResize);
    };
  }, [dragged, handleWindowResize]);

  return (
    <div
      className={classNames(Css.main, preloaderShown && Css.preloaderShown)}
      style={{ top: positionY ? `${positionY}px` : "50%" }}
      onMouseDown={handleMouseDown}
      onClick={handleButtonClick}>
      <Logo />
      {!!notificationsCount && (
        <Badge
          className={Css.badge}
          theme={currentBusiness ? "primary" : "danger"}>
          {notificationsCount}
        </Badge>
      )}
    </div>
  );
};

export default Main;
