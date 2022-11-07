import Css from "../../style.module.scss";

import classNames from "classnames";
import React from "react";

const TableRow = ({ className, ...restProps }) => {
  return (
    <div className={classNames(Css.tableRow, className)} {...restProps} />
  );
};

export default TableRow;