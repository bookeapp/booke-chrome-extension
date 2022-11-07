import Css from "../../style.module.scss";

import React from "react";
import classNames from "classnames";

const TableCell = ({ className, ...restProps }) => {
  return (
    <div className={classNames(Css.tableCell, className)} {...restProps} />
  );
};

export default TableCell;