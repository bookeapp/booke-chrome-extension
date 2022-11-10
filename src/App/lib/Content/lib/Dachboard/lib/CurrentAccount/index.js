import Css from "./style.module.scss";

import { getBusinessesData } from "selectors";
import { log, normalizeId, waitUntil } from "utils";
import { useSelector } from "react-redux";
import Button from "lib/Button";
import Check from "./lib/Check";
import Preloader from "lib/Preloader";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
      const nodes = document.querySelectorAll("#statementLines [data-statementlineid]");

      await waitUntil(() => {
        return !nodes.querySelector(".statement.load");
      });

      if (!nodes.length) {
        setPreloaderShown(false);

        return;
      }

      const statementMatchedNodes = [...nodes].map((node) => {
        const matched = node.querySelector(".statement.matched");

        if (matched) return matched;

        const comment = node.querySelector(".statement.comments");

        if (comment) {
          const tab = comment.querySelector(".tabs .t1");

          if (tab) tab.click();
        }

        return null;
      }).filter(Boolean);

      if (!statementMatchedNodes.length) {
        setPreloaderShown(false);

        return;
      }

      setTimeout(() => {
        const items = statementMatchedNodes.map((statementMatched) => {
          const detailsContainer = statementMatched.querySelector(".details-container");

          if (!detailsContainer) return null;

          const [timestampNode, addressNode, descriptionNode] = detailsContainer.querySelectorAll(".details span");

          return {
            id: statementMatched.id,
            addressName: addressNode?.textContent || "",
            amoun: detailsContainer.querySelector(".amount.set")?.textContent || "",
            description: descriptionNode?.textContent || "",
            timestamp: timestampNode?.textContent || ""
          };
        }).filter(Boolean);

        log({ items });

        setItemsToReconcile(items);
        setPreloaderShown(false);
      }, 0);
    } catch (exeption) {
      log("ERROR getItemsToReconcile", exeption);
      setPreloaderShown(false);
    }
  }, []);

  const handleStartClick = useCallback(() => {
    setInProgress(true);
  }, []);

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
        if (inProgress) {
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
