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
    <div  className="Dashboard">
      <div className="header">
        <div className="top">
          <div className="logo"><LogoFull /></div>
          <div className="close" onClick={handleCloseClick} />
        </div>
        <div className="business">
          New business from Xero
        </div>
      </div>
      <Accounts />     
    </div>
  );
};

export default Dashboard;