import Css from "./style.module.scss";

import { VIEWS } from "const/Constants";
import { getBusinessesData } from "selectors";
import { uiSlice } from "slices";
import { useDispatch, useSelector } from "react-redux";
import Accounts from "./lib/Accounts";
import CurrentAccount from "./lib/CurrentAccount";
import LogoFull from "./lib/LogoFull";
import React, { useCallback } from "react";

const Dashboard = () => {
  const dispatch = useDispatch();

  const businessesData = useSelector(getBusinessesData);

  const handleCloseClick = useCallback(() => {
    dispatch(uiSlice.actions.setCurrentView(VIEWS.MAIN));
  }, [dispatch]);

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
      {businessesData.length
        ? (
          <>
            <CurrentAccount />
            <Accounts />
          </>
        )
        : (
          <div className={Css.emptyState}>
            Well done! You have no transactions to reconcile
          </div>
        )}
    </div>
  );
};

export default Dashboard;
