import Css from "./style.module.scss";

import React from "react";
import classNames from "classnames";
import TableCell from "./lib/TableCell";
import TableHead from "./lib/TableHead";
import TableRow from "./lib/TableRow";

const Table = ({ className, ...restProps }) => {
  return (
    <div className={classNames(Css.table, className)} {...restProps} />
  );
};

export default Table;

export {
  TableCell,
  TableHead,
  TableRow,
};