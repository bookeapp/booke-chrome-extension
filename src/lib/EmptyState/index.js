import Css from "./style.module.scss";

import IconCheck from "lib/IconCheck";
import IconWarningCircle from "lib/IconWarningCircle";
import React from "react";
import classNames from "classnames";

const THEMES = {
  warning: Css.warning
};

const ICONS = {
  default: IconCheck,
  warning: IconWarningCircle
};

const EmptyState = ({ children, theme, ...restProps }) => {
  const Icon = ICONS[theme] || ICONS.default;

  return (
    <div className={classNames(Css.emptyState, THEMES[theme])} {...restProps}>
      <div className={Css.icon}><Icon /></div>
      <div className={Css.text}>{children}</div>
    </div>
  );
};

export default EmptyState;
