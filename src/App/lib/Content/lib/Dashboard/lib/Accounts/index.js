import Css from "./style.module.scss";

import { getBusinessesData } from "selectors";
import { normalizeId } from "utils";
import { useSelector } from "react-redux";
import Badge from "lib/Badge";
import Button from "lib/Button";
import EmptyState from "lib/EmptyState";
import IconArrowRight from "./lib/IconArrowRight";
import React from "react";
import Table, { TableCell, TableHead, TableRow } from "lib/Table";

const Accounts = ({ currentBusiness }) => {
  const businessesData = useSelector(getBusinessesData);

  const filteredBusiness = businessesData.filter((business) => {
    return business.transactions && (!currentBusiness || currentBusiness.xeroAccountId !== business.xeroAccountId);
  });

  if (!businessesData.length) {
    return (
      <EmptyState theme="warning">You have no business added to Booke.ai</EmptyState>
    );
  }

  if (!filteredBusiness.length) {
    return null;
  }

  return (
    <div className={Css.accounts}>
      <Table className={Css.table}>
        <TableRow>
          <TableHead className={Css.nameCell}>Account</TableHead>
          <TableHead className={Css.toReconcileCell}>To Reconcile</TableHead>
          <TableHead className={Css.actionCell} />
        </TableRow>
        {filteredBusiness.map(({ xeroAccountId, name, transactions }) => (
          <TableRow key={xeroAccountId}>
            <TableCell className={Css.nameCell}>
              <div className={Css.name} title={name}>{name}</div>
            </TableCell>
            <TableCell className={Css.toReconcileCell}>
              <Badge className={Css.badge}>{transactions}</Badge>
            </TableCell>
            <TableCell className={Css.actionCell}>
              <a href={`${window.location.origin}/BankRec/BankRec.aspx?accountID=${normalizeId(xeroAccountId)}`}>
                <Button size="small" className={Css.button}>Go to <IconArrowRight /></Button>
              </a>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
};

export default Accounts;
