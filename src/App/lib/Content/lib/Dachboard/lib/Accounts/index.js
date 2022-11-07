import Css from "./style.module.scss";

import React from "react";
import IconArrowRight from "./lib/IconArrowRight";
import Table, { TableCell, TableHead, TableRow } from "lib/Table";
import Badge from "lib/Badge";
import Button from "lib/Button";

const ACCOUNTS = [
  {
    id: 1,
    name: "Stripe Bank Account",
    count: 6
  },
  {
    id: 2,
    name: "Reserve Account CD",
    count: 69
  },
  {
    id: 3,
    name: "Flip Cause",
    count: 34
  },
  {
    id: 4,
    name: "Undeposited Funds",
    count: 25
  },
];

const Accounts = () => {
  return (
    <div className={Css.accounts}>
      <div className={Css.title}>Accounts</div>
      <Table className={Css.table}>
        <TableRow>
          <TableHead className={Css.nameCell}>Account</TableHead>
          <TableHead className={Css.toReconcileCell}>To Reconcile</TableHead>
          <TableHead className={Css.actionCell} />
        </TableRow>
        {ACCOUNTS.map(({ id, name, count }) => (
          <TableRow key={id}>
            <TableCell className={Css.nameCell}>{name}</TableCell>
            <TableCell className={Css.toReconcileCell}>
              <Badge className={Css.badge}>{count}</Badge>
            </TableCell>
            <TableCell className={Css.actionCell}>
              <Button className={Css.button}>Go to <IconArrowRight /></Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>      
    </div> 
  );
};

export default Accounts;