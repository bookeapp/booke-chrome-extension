import Css from "./style.module.scss";

import React from "react";
import classNames from "classnames";

const THEMES = {
  success: Css.success,
};

const SIZES = {
  small: Css.small,
};

const Button = ({ className, block, theme, size, ...restProps }) => {
  return (
    <div 
      className={classNames(Css.button, {
        [Css.block]: block,
      }, THEMES[theme], SIZES[size], className)} 
      {...restProps} />
  );
};

export default Button;