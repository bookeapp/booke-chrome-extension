import Css from "./style.module.scss";

import { PROCENTS } from "const/Constants";
import { delay, runInSequence } from "utils";
import { fetchStats, uiSlice } from "slices";
import { getBookeTransactions, getCurrentProgress, getCurrentShortCode, getFetchingState } from "selectors";
import { useDispatch, useSelector } from "react-redux";
import Button from "lib/Button";
import EmptyState from "lib/EmptyState";
import Preloader from "lib/Preloader";
import React, { useCallback, useState } from "react";
import api from "api/Api";

const CurrentAccount = ({ currentBusiness }) => {
  const { name: businessName, transactions } = currentBusiness;

  const dispatch = useDispatch();

  const currentShortCode = useSelector(getCurrentShortCode);

  const fetching = useSelector(getFetchingState);

  const bookeTransactions = useSelector(getBookeTransactions);

  const currentProgress = useSelector(getCurrentProgress);

  const [, setFetching] = useState(false);

  const handleStartClick = useCallback(async() => {
    dispatch(uiSlice.actions.setCurrentProgress({ value: 0 }));

    const result = (await runInSequence(bookeTransactions.map((item, index) => {
      return async() => {
        await delay(300); // eslint-disable-line no-magic-numbers

        const statement = document.getElementById(item.id);

        if (!statement) return null;

        const button = statement.querySelector(".okayButton");

        if (!button) return null;
        button.removeAttribute("href");
        button.click();
        dispatch(uiSlice.actions.setCurrentProgress({ value: (index + 1) / bookeTransactions.length }));

        return item;
      };
    }))).filter(Boolean);

    setFetching(true);

    dispatch(uiSlice.actions.setBookeTransactions([]));

    if (result.length) {
      await api.reconcileStatements({
        accountId: currentBusiness.xeroAccountId,
        transactions: result
      });
    }
    dispatch(uiSlice.actions.setCurrentProgress(null));
    await dispatch(fetchStats(currentShortCode));
    setFetching(false);
  }, [currentBusiness, bookeTransactions, currentShortCode, dispatch]);

  return (
    <div className={Css.currentAccount}>
      {!!businessName && !!transactions && (
        <div className={Css.header}>
          <div className={Css.name}>{businessName}</div>
          {!!transactions && (
            <div className={Css.count}>{`${(bookeTransactions || []).length}/${transactions} transactions`}</div>
          )}
        </div>
      )}
      {(() => {
        if (currentProgress) {
          const procents = `${Math.ceil(currentProgress.value * PROCENTS)}%`;

          return (
            <div className={Css.progress}>
              <div className={Css.label}>
                <div>Progress</div>
                <div>{procents}</div>
              </div>
              <div className={Css.bar}>
                <div className={Css.fill} style={{ width: procents }} />
              </div>
            </div>
          );
        }

        if (!bookeTransactions) {
          return <Preloader className={Css.preloader} />;
        }

        if (bookeTransactions.length) {
          return (
            <Button
              block
              disabled={fetching}
              theme="success"
              onClick={handleStartClick}>
              {`Reconcile ${bookeTransactions.length} Booke AI transactions`}
            </Button>
          );
        }

        if (!transactions) {
          return (
            <EmptyState theme="success">No Booke AI transactions to reconcile</EmptyState>
          );
        }

        return (
          <EmptyState>There are no Booke AI transactions on this page</EmptyState>
        );
      })()}
    </div>
  );
};

export default CurrentAccount;
