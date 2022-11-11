import Css from "./style.module.scss";

import { getBusinessesData } from "selectors";
import { log, normalizeId, waitUntil } from "utils";
import { useSelector } from "react-redux";
import Button from "lib/Button";
import Check from "./lib/Check";
import Preloader from "lib/Preloader";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "api/Api";
import useEnvVars from "hooks/useEnvVars";

const CurrentAccount = () => {
  const [{ accountID: accountId }] = useEnvVars();

  const businessesData = useSelector(getBusinessesData);

  const [inProgress, setInProgress] = useState(false);

  const [preloaderShown, setPreloaderShown] = useState(true);

  const [itemsToReconcile, setItemsToReconcile] = useState([]);

  const currentBusiness = useMemo(() => {
    return businessesData.find(({ xeroAccountId }) => {
      return xeroAccountId === accountId || normalizeId(xeroAccountId) === accountId;
    });
  }, [accountId, businessesData]);

  const findItemsToReconcile = useCallback(async() => {
    try {
      const statementLinesNode = document.querySelector("#statementLines");

      await waitUntil(() => {
        return !statementLinesNode.querySelector(".statement.load");
      });

      const nodes = statementLinesNode.querySelectorAll("[data-statementlineid]");

      if (!nodes.length) {
        setPreloaderShown(false);

        return;
      }

      [...nodes].forEach((node) => {
        const comment = node.querySelector(".statement.comments");

        if (comment) {
          const tab = comment.querySelector(".tabs .t1");

          if (tab) tab.click();
        }
      });

      const statementMatchedNodes = [...nodes].map((node) => {
        return node.querySelector(".statement.matched");
      }).filter(Boolean);

      if (!statementMatchedNodes.length) {
        setPreloaderShown(false);

        return;
      }

      const items = [...nodes].map((node) => {
        const statementMatched = node.querySelector(".statement.matched");

        const detailsContainer = statementMatched.querySelector(".details-container");

        if (!detailsContainer) return null;

        const [timestampNode, addressNode, descriptionNode] = detailsContainer.querySelectorAll(".details span");

        const [amounNodeSpent, amountNodeReceived] = detailsContainer.querySelector(".amount");

        const spent = (parseFloat(amounNodeSpent?.textContent || 0));

        const received = (parseFloat(amountNodeReceived?.textContent || 0));

        const amount = spent || received;

        return {
          id: node.id,
          addressName: addressNode?.textContent || undefined,
          amoun: amount * (spent ? -1 : 1) || undefined,
          description: descriptionNode?.textContent?.replace("Ref: ", "") || undefined,
          timestamp: timestampNode?.textContent || undefined
        };
      }).filter(Boolean);

      log({ items });

      setItemsToReconcile(items);
      setPreloaderShown(false);
    } catch (exeption) {
      log("ERROR getItemsToReconcile", exeption);
      setPreloaderShown(false);
    }
  }, []);

  const handleStartClick = useCallback(async() => {
    setInProgress(true);

    const result = await api.checkStatements({
      transactions: itemsToReconcile,
      accountId: currentBusiness.xeroAccountId
    });

    log({ result });
  }, [itemsToReconcile, currentBusiness]);

  useEffect(() => {
    if (!accountId) return;

    findItemsToReconcile();
  }, [accountId, findItemsToReconcile]);

  if (!currentBusiness) return null;

  const { name: businessName, transactions } = currentBusiness;

  return (
    <div className={Css.currentAccount}>
      <div className={Css.header}>
        <div className={Css.name}>{businessName}</div>
        {!!transactions && (
          <div className={Css.count}>{`${transactions} transactions`}</div>
        )}
      </div>
      {(() => {
        if (preloaderShown) return (<Preloader />);

        if (inProgress) {
          return (
            <div className={Css.progress}>
              <div className={Css.label}>
                <div>Progress</div>
                <div>90% (20 sec left)</div>
              </div>
              <div className={Css.bar}>
                <div className={Css.fill} style={{ width: "10%" }} />
              </div>
            </div>
          );
        }

        if (itemsToReconcile) {
          return (
            <Button
              block
              theme="success"
              onClick={handleStartClick}>
              Reconcile Booke transactions
            </Button>
          );
        }

        return (
          <div className={Css.message}>
            <div className={Css.icon}><Check /></div>
            <div className={Css.text}>On the <b>Stripe Bank Account</b>, all transactions have been successfully reconciled</div>
          </div>
        );
      })()}
    </div>
  );
};

export default CurrentAccount;
