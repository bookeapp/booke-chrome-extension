import Css from "./style.module.scss";

import { LOGO_IMG_DATA_URI } from "const/Constants";
import { getBusinessesData } from "selectors";
import { log, normalizeId, waitUntil } from "utils";
import { useSelector } from "react-redux";
import Button from "lib/Button";
import Check from "./lib/Check";
import Preloader from "lib/Preloader";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "api/Api";
import createElement from "utils/createElement";
import moment from "moment/moment";
import useEnvVars from "hooks/useEnvVars";

const PROCENTS = 100;

const MAX_WAITING = 1000;

const clickOnButton = async(items, index, callback) => {
  if (index < items.length) {
    const item = items[index];

    if (item) {
      const { id } = item;

      const statement = document.getElementById(id);

      if (statement) {
        const button = statement.querySelector(".okayButton");

        if (button) {
          button.click();

          await waitUntil(() => {
            return !document.getElementById(id);
          }, MAX_WAITING);
        }
      }
    }
    callback(index + 1, items.lenght);
    clickOnButton(index + 1);
  }
};

const CurrentAccount = () => {
  const [{ accountID: accountId }] = useEnvVars();

  const businessesData = useSelector(getBusinessesData);

  const [currentProgress, setCurrentProgress] = useState(null);

  const [preloaderShown, setPreloaderShown] = useState(true);

  const [itemsFromBooke, setItemsFromBooke] = useState([]);

  const currentBusiness = useMemo(() => {
    return businessesData.find(({ xeroAccountId }) => {
      return xeroAccountId === accountId || normalizeId(xeroAccountId) === accountId;
    });
  }, [accountId, businessesData]);

  const finditemsFromBooke = useCallback(async() => {
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

      /* [...nodes].forEach((node) => {
        const comment = node.querySelector(".statement.comments");

        if (comment) {
          const tab = comment.querySelector(".tabs .t1");

          if (tab) tab.click();
        }
      }); */

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

        const [amounNodeSpent, amountNodeReceived] = detailsContainer.querySelectorAll(".amount");

        const spent = (parseFloat(amounNodeSpent?.textContent?.replace(/,/g, "") || 0));

        const received = (parseFloat(amountNodeReceived?.textContent?.replace(/,/g, "") || 0));

        const amount = spent || received;

        const timestamp = timestampNode?.textContent;

        return {
          id: node.id,
          addressName: addressNode?.textContent || undefined,
          amount: amount * (spent ? -1 : 1) || undefined,
          description: descriptionNode?.textContent?.replace("Ref: ", "") || undefined,
          timestamp: timestamp ? moment.utc(timestampNode?.textContent).toISOString() : undefined
        };
      }).filter(Boolean);

      log({ items });

      const response = await api.checkStatements({
        transactions: items,
        accountId: currentBusiness.xeroAccountId
      });

      log({ response });

      if (!response || !response.results || !response.results.length) return;

      const fromBooke = response.results.map((result, index) => {
        if (!result) return null;

        const item = items[index];

        const node = document.getElementById(item.id);

        if (!node) return null;

        node.querySelector(".ok")?.appendChild(
          createElement("div", { className: Css.buttonLogo }, createElement("img", { src: LOGO_IMG_DATA_URI }))
        );

        return item;
      }).filter(Boolean);

      setItemsFromBooke(fromBooke);
      setPreloaderShown(false);
    } catch (exeption) {
      log("ERROR getitemsFromBooke", exeption);
      setPreloaderShown(false);
    }
  }, [currentBusiness.xeroAccountId]);

  const handleStartClick = useCallback(() => {
    setCurrentProgress({ value: 0 });

    setItemsFromBooke([]);

    clickOnButton(itemsFromBooke, 0, async(current, all) => {
      const progress = current / all;

      if (progress === 1) {
        await api.reconcileStatements({
          accountId: currentBusiness.xeroAccountId,
          transactions: itemsFromBooke
        });
        setCurrentProgress(null);
      } else {
        setCurrentProgress({ value: current / all });
      }
    });
  }, [currentBusiness.xeroAccountId, itemsFromBooke]);

  useEffect(() => {
    if (!accountId) return;

    finditemsFromBooke();
  }, [accountId, finditemsFromBooke]);

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

        if (currentProgress) {
          const procents = `${currentProgress * PROCENTS}%`;

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

        if (itemsFromBooke.length) {
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
