import Css from "./style.module.scss";

import React from "react";
import classNames from "classnames";

const THEMES = {
  danger: Css.danger,
  primary: Css.primary,
};

const Badge = ({ className, theme, ...restProps }) => {
  return (
    <div className={classNames(Css.badge, THEMES[theme], className)} {...restProps} />
  );
};

export default Badge;
