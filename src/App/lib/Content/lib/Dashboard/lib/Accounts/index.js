import Css from "./style.module.scss";

import { RECONCILE_PATH } from "const/Constants";
import { getBusinessesData } from "selectors";
import { normalizeId } from "utils";
import { useSelector } from "react-redux";
import Badge from "lib/Badge";
import Button from "lib/Button";
import IconArrowRight from "./lib/IconArrowRight";
import IconCheck from "lib/IconCheck";
import React, { useMemo } from "react";
import Table, { TableCell, TableHead, TableRow } from "lib/Table";
import useEnvVars from "hooks/useEnvVars";

const Accounts = () => {
  const [{ accountID: accountId }] = useEnvVars();

  const businessesData = useSelector(getBusinessesData);

  const filteredBusiness = useMemo(() => {
    return businessesData.filter(({ xeroAccountId, transactions }) => {
      return (
        (location.pathname !== RECONCILE_PATH)
          || (normalizeId(xeroAccountId) !== normalizeId(accountId))
      )
        && transactions;
    });
  }, [accountId, businessesData]);

  if (!filteredBusiness.length) {
    if (accountId) return null;

    return (
      <div className={Css.emptyState}>
        <div className={Css.icon}><IconCheck /></div>
        <div>Well done! You have no transactions to reconcile</div>
      </div>
    );
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
