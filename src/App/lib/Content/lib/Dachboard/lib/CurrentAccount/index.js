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
import useEnvVars from "hooks/useEnvVars";

const PROCENTS = 100;

const parseTime = (text) => {
  try {
    const date = new Date(text);

    date.setMinutes(-date.getTimezoneOffset());

    return date.toISOString();
  } catch (exeption) {}

  return undefined;
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

      if (!statementLinesNode) {
        setPreloaderShown(false);

        return;
      }

      await waitUntil(() => {
        return !statementLinesNode.querySelector(".statement.load");
      });

      const nodes = statementLinesNode.querySelectorAll("[data-statementlineid]");

      /* [...nodes].forEach((node) => {
        const comment = node.querySelector(".statement.comments");

        if (comment) {
          const tab = comment.querySelector(".tabs .t1");

          if (tab) tab.click();
        }
      }); */

      const items = [...nodes].map((node) => {
        const detailsContainer = node.querySelector(".statement.matched .details-container");

        if (!detailsContainer) return null;

        const [timestampNode, addressNode, descriptionNode] = detailsContainer.querySelectorAll(".details span");

        const [amounNodeSpent, amountNodeReceived] = detailsContainer.querySelectorAll(".amount");

        const spent = (parseFloat(amounNodeSpent?.textContent?.replace(/,/g, "") || 0));

        const received = (parseFloat(amountNodeReceived?.textContent?.replace(/,/g, "") || 0));

        const amount = spent || received;

        return {
          id: node.id,
          addressName: addressNode?.textContent || undefined,
          amount: amount * (spent ? -1 : 1) || undefined,
          description: descriptionNode?.textContent?.replace("Ref: ", "") || undefined,
          timestamp: parseTime(timestampNode?.textContent)
        };
      }).filter(Boolean);

      log({ items });

      if (!items.length) {
        setPreloaderShown(false);

        return;
      }

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

        const container = node.querySelector(".statement.matched .info.c0");

        if (container) {
          container.classList.add(Css.container);

          container.appendChild(
            createElement("div", { className: Css.buttonLogo }, createElement("img", { src: LOGO_IMG_DATA_URI }))
          );
        }

        return item;
      }).filter(Boolean);

      setItemsFromBooke(fromBooke);
      setPreloaderShown(false);
    } catch (exeption) {
      log("ERROR getitemsFromBooke", exeption);
      setPreloaderShown(false);
    }
  }, [currentBusiness]);

  const handleStartClick = useCallback(() => {
    setCurrentProgress({ value: 0 });

    itemsFromBooke.forEach(async(item, index) => {
      const { id } = item;

      const statement = document.getElementById(id);

      if (statement) {
        const button = statement.querySelector(".okayButton");

        if (button) {
          button.removeAttribute("href");
          await waitUntil(() => false, 100 * index); // eslint-disable-line no-magic-numbers
          button.click();
          setCurrentProgress({ value: itemsFromBooke.length / (index + 1) });
          if (!itemsFromBooke.length - index - 1) {
            setItemsFromBooke([]);
            await api.reconcileStatements({
              accountId: currentBusiness.xeroAccountId,
              transactions: itemsFromBooke
            });
            setCurrentProgress(null);
            setPreloaderShown(true);
            await waitUntil(() => false, 5000); // eslint-disable-line no-magic-numbers
            finditemsFromBooke();
          }
        }
      }
    });
  }, [currentBusiness, itemsFromBooke, finditemsFromBooke]);

  const handleFindTransactions = useCallback(async() => {
    setPreloaderShown(true);
    await waitUntil(() => false, 1000); // eslint-disable-line no-magic-numbers
    finditemsFromBooke();
  }, [finditemsFromBooke]);

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
          const procents = `${currentProgress.value * PROCENTS}%`;

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

        if (!transactions) {
          return (
            <div className={Css.message}>
              <div className={Css.icon}><Check /></div>
              <div className={Css.text}>On the <b>{businessName}</b>, all transactions have been successfully reconciled</div>
            </div>
          );
        }

        return (
          <Button block onClick={handleFindTransactions}>
            Find Booke transactions
          </Button>
        );
      })()}
    </div>
  );
};

export default CurrentAccount;
