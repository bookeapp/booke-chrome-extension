import Css from "./style.module.scss";

import { getBusinessesData } from "selectors";
import { normalizeId } from "utils";
import { useSelector } from "react-redux";
import Button from "lib/Button";
import Check from "./lib/Check";
import React, { useMemo, useState } from "react";
import useEnvVars from "hooks/useEnvVars";

const TYPES = {
  INITIAL: 0,
  PROGRESS: 1,
  DONE: 2
};

const Initial = () => {
  return (<Button block theme="success">Reconcile Booke transactions</Button>);
};

const Progress = () => {
  return (
    <div className={Css.progress}>
      <div className={Css.label}>
        <div>Progress</div>
        <div>90% (20 sec left)</div>
      </div>
      <div className={Css.bar}>
        <div className={Css.fill} style={{ width: "90%" }} />
      </div>
    </div>
  );
};

const Message = () => {
  return (
    <div className={Css.message}>
      <div className={Css.icon}><Check /></div>
      <div className={Css.text}>On the <b>Stripe Bank Account</b>, all transactions have been successfully reconciled</div>
    </div>
  );
};

const Content = ({ type }) => {
  switch (type) {
    case TYPES.PROGRESS:
      return (<Progress />);
    case TYPES.DONE:
      return (<Message />);
    default:
      return (<Initial />);
  }
};

const CurrentAccount = () => {
  const [{ accountID: accountId }] = useEnvVars();

  const businessesData = useSelector(getBusinessesData);

  const [type, setType] = useState(TYPES.DONE);

  const currentBusiness = useMemo(() => {
    return businessesData.find(({ xeroAccountId }) => {
      return normalizeId(xeroAccountId) === accountId;
    });
  }, [accountId, businessesData]);

  if (!currentBusiness) return null;

  return (
    <div className={Css.currentAccount}>
      <div className={Css.header}>
        <div className={Css.name}>Stripe Bank Account</div>
        <div className={Css.count}>6 transactions</div>
      </div>
      <Content type={type} />
    </div>
  );
};

export default CurrentAccount;
