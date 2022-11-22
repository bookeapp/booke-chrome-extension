import Css from "./style.module.scss";

import { RECONCILE_PATH, VIEWS } from "const/Constants";
import { getBusinessesData } from "selectors";
import { normalizeId } from "utils";
import { uiSlice } from "slices";
import { useDispatch, useSelector } from "react-redux";
import Accounts from "./lib/Accounts";
import CurrentAccount from "./lib/CurrentAccount";
import EmptyState from "lib/EmptyState";
import LogoFull from "./lib/LogoFull";
import React, { useCallback, useState } from "react";
import classNames from "classnames";
import useEnvVars from "hooks/useEnvVars";

const Dashboard = () => {
  const dispatch = useDispatch();

  const [{ accountID: accountId }] = useEnvVars();

  const businessesData = useSelector(getBusinessesData);

  const [slideToRight, setSlideToRight] = useState(false);

  const currentBusiness = location.pathname === RECONCILE_PATH
    && businessesData.find(({ xeroAccountId }) => {
      return normalizeId(xeroAccountId) === normalizeId(accountId);
    });

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
