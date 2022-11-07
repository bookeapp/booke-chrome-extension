import Css from "../../style.module.scss";

import classNames from "classnames";
import React from "react";
import TableCell from "../TableCell";

const TableHead = ({ className, ...restProps }) => {
  return (
    <TableCell className={classNames(Css.tableHead, className)} {...restProps} />
  );
};

export default TableHead;