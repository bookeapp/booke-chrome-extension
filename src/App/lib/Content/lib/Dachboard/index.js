import Css from "./style.module.scss";

import { VIEWS } from "const/Constants";
import { getPositionY } from "selectors";
import { uiSlice } from "slices";
import { useDispatch, useSelector } from "react-redux";
import Accounts from "./lib/Accounts";
import CurrentAccount from "./lib/CurrentAccount";
import LogoFull from "./lib/LogoFull";
import React, { useCallback } from "react";

const Dashboard = () => {
  const dispatch = useDispatch();

  const positionY = useSelector(getPositionY);

  const handleCloseClick = useCallback(() => {
    dispatch(uiSlice.actions.setCurrentView(VIEWS.MAIN));
  }, [dispatch]);

  return (
    <div className={Css.dashboard} style={{ top: `${positionY}px` }}>
      <div className={Css.header}>
        <div className={Css.top}>
          <div className={Css.log}><LogoFull /></div>
          <div className={Css.close} onClick={handleCloseClick} />
        </div>
      </div>
      <CurrentAccount />
      <Accounts />
    </div>
  );
};

export default Dashboard;
