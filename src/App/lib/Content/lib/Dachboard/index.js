import Css from "./style.module.scss";

import { VIEWS } from "const/Constants";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { uiSlice } from "slices";
import Accounts from "./lib/Accounts";
import LogoFull from "./lib/LogoFull";

const Dashboard = () => {
  const dispatch = useDispatch();
    
  const handleCloseClick = useCallback(() => {
    dispatch(uiSlice.actions.setCurrentView(VIEWS.MAIN));
  }, []);
    
  return (
    <div className={Css.dashboard}>
      <div className={Css.header}>
        <div className={Css.top}>
          <div className={Css.log}><LogoFull /></div>
          <div className={Css.close} onClick={handleCloseClick} />
        </div>
        <div className={Css.business}>
          New business from Xero
        </div>
      </div>
      <Accounts />     
    </div>
  );
};

export default Dashboard;