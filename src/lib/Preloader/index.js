import Css from "./style.module.scss";

import React from "react";
import classNames from "classnames";

const Preloader = ({ className, absolute, fixed }) => {
  return (
    <div
      className={classNames(Css.preloader, { 
        [Css.absolute]: absolute, 
        [Css.fixed]: fixed, 
      }, className)}>
      <div className={Css.animation}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default Preloader;
