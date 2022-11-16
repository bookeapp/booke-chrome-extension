import Css from "./style.module.scss";

import React from "react";
import classNames from "classnames";

const Badge = ({ className, ...restProps }) => {
  return (
    <div className={classNames(Css.badge, className)} {...restProps} />
  );
};

export default Badge;
