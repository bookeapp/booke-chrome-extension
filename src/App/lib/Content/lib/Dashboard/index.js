import Css from "./style.module.scss";

import { VIEWS } from "const/Constants";
import { getBusinessesData } from "selectors";
import { uiSlice } from "slices";
import { useDispatch, useSelector } from "react-redux";
import Accounts from "./lib/Accounts";
import CurrentAccount from "./lib/CurrentAccount";
import EmptyState from "lib/EmptyState";
import LogoFull from "./lib/LogoFull";
import React, { useCallback, useState } from "react";
import classNames from "classnames";

const Dashboard = ({ currentBusiness }) => {
  const dispatch = useDispatch();

  const businessesData = useSelector(getBusinessesData);

  const [slideToRight, setSlideToRight] = useState(false);

  const handleCloseClick = useCallback(() => {
    setSlideToRight(true);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (slideToRight) {
      dispatch(uiSlice.actions.setCurrentView(VIEWS.MAIN));
    }
  }, [slideToRight, dispatch]);

  return (
    <div
      className={classNames(Css.dashboard, slideToRight && Css.slideToRight)}
      onAnimationEnd={handleAnimationEnd}>
      <div className={Css.header}>
        <div className={Css.top}>
          <div className={Css.log}><LogoFull /></div>
          <div className={Css.close} onClick={handleCloseClick} />
        </div>
      </div>
      {businessesData.length
        ? (
          <>
            {!!currentBusiness && (
              <CurrentAccount currentBusiness={currentBusiness} />
            )}
            <Accounts currentBusiness={currentBusiness} />
          </>
        )
        : (
          <EmptyState theme="success">No Booke AI transactions to reconcile</EmptyState>
        )}

    </div>
  );
};

export default Dashboard;
