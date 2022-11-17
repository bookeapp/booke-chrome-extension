import Css from "./style.module.scss";

import { VIEWS } from "const/Constants";
import { uiSlice } from "slices";
import { useDispatch } from "react-redux";
import Accounts from "./lib/Accounts";
import CurrentAccount from "./lib/CurrentAccount";
import LogoFull from "./lib/LogoFull";
import React, { useCallback, useState } from "react";
import classNames from "classnames";

const Dashboard = () => {
  const dispatch = useDispatch();

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
      <CurrentAccount />
      <Accounts />
    </div>
  );
};

export default Dashboard;
