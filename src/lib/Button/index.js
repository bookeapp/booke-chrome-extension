import Css from "./style.module.scss";

import React from "react";
import classNames from "classnames";

const Button = ({ className, ...restProps }) => {
  return (
    <div className={classNames(Css.button, className)} {...restProps} />
  );
};

export default Button;