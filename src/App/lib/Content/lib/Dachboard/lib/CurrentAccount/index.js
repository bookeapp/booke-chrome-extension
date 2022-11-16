import Css from "./style.module.scss";

import { API_CHECK_INTERVAL, FIND_MATCHES_INTERVAL, LOGO_IMG_DATA_URI, PROCENTS } from "const/Constants";
import { getBusinessesData } from "selectors";
import { log, normalizeId, waitUntil } from "utils";
import { useSelector } from "react-redux";
import Button from "lib/Button";
import IconCheck from "lib/IconCheck";
import Preloader from "lib/Preloader";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "api/Api";
import createElement from "utils/createElement";
import useEnvVars from "hooks/useEnvVars";

const parseTime = (text) => {
  try {
    const date = new Date(text);

    date.setMinutes(-date.getTimezoneOffset());

    return date.toISOString();
  } catch (exception) {}

  return undefined;
};

const CurrentAccount = () => {
  const [{ accountID: accountId }] = useEnvVars();

  const businessesData = useSelector(getBusinessesData);

  const [matchedTransactionsIdsHash, setMatchedTransactionsIdsHash] = useState("");

  const [currentProgress, setCurrentProgress] = useState(null);

  const [preloaderShown, setPreloaderShown] = useState(false);

  const [itemsFromBooke, setItemsFromBooke] = useState([]);

  const inProgress = !!currentProgress;

  const currentBusiness = useMemo(() => {
    return businessesData.find(({ xeroAccountId }) => {
      return xeroAccountId === accountId || normalizeId(xeroAccountId) === accountId;
    });
  }, [accountId, businessesData]);

  const findMatchedTransactions = useCallback(async() => {
    try {
      const statementLinesNode = document.querySelector("#statementLines");

      if (!statementLinesNode) return;

      await waitUntil(() => {
        return !statementLinesNode.querySelector(".statement.load");
      });

      const nodes = statementLinesNode.querySelectorAll("[data-statementlineid]");

      if (!nodes.length) return;

      setMatchedTransactionsIdsHash(JSON.stringify([...nodes].map((node) => node.id).sort()));
    } catch (exception) {}
  }, []);

  const checkTransactions = useCallback(async(ids) => {
    try {
      const items = ids.map((id) => {
        const node = document.getElementById(id);

        if (!node) return null;

        const detailsContainer = node.querySelector(".statement.matched .details-container");

        if (!detailsContainer) return null;

        const [timestampNode, addressNode, descriptionNode] = detailsContainer.querySelectorAll(".details span");

        const [amounNodeSpent, amountNodeReceived] = detailsContainer.querySelectorAll(".amount");

        const spent = (parseFloat(amounNodeSpent?.textContent?.replace(/,/g, "") || 0));

        const received = (parseFloat(amountNodeReceived?.textContent?.replace(/,/g, "") || 0));

        const amount = spent || received;

        return {
          addressName: addressNode?.textContent || undefined,
          amount: amount * (spent ? -1 : 1) || undefined,
          description: descriptionNode?.textContent?.replace("Ref: ", "") || undefined,
          timestamp: parseTime(timestampNode?.textContent)
        };
      }).filter(Boolean);

      if (!items.length) return;

      setPreloaderShown(true);

      const response = await api.checkStatements({
        transactions: items,
        accountId: currentBusiness.xeroAccountId
      });

      log({ response });

      if (!response || !response.results || !response.results.length) return;

      const fromBooke = response.results.map((result, index) => {
        if (!result) return null;

        const node = document.getElementById(ids[index]);

        if (!node) return null;

        const container = node.querySelector(".statement.matched .info.c0");

        if (container) {
          container.classList.add(Css.container);

          container.appendChild(
            createElement("div", { className: Css.buttonLogo }, createElement("img", { src: LOGO_IMG_DATA_URI }))
          );
        }

        return ids[index];
      }).filter(Boolean);

      setItemsFromBooke(fromBooke);
      setPreloaderShown(false);
    } catch (exception) {
      log("ERROR getitemsFromBooke", exception);
      setPreloaderShown(false);
    }
  }, [currentBusiness]);

  useEffect(() => {
    if (!currentBusiness || inProgress) return;

    let timeoutId;

    const find = () => {
      findMatchedTransactions();
      timeoutId = setTimeout(() => {
        find();
      }, (FIND_MATCHES_INTERVAL));
    };

    find();

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutId);
  }, [inProgress, currentBusiness, findMatchedTransactions]);

  useEffect(() => {
    if (!matchedTransactionsIdsHash) return;

    const ids = JSON.parse(matchedTransactionsIdsHash);

    if (!ids.length) return;

    let timeoutId;

    const check = () => {
      checkTransactions(ids);
      timeoutId = setTimeout(() => {
        check();
      }, (API_CHECK_INTERVAL));
    };

    check();

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutId);
  }, [matchedTransactionsIdsHash, checkTransactions]);

  const handleStartClick = useCallback(() => {
    setCurrentProgress({ value: 0 });

    itemsFromBooke.forEach(async(id, index) => {
      const statement = document.getElementById(id);

      if (statement) {
        const button = statement.querySelector(".okayButton");

        if (button) {
          button.removeAttribute("href");
          await waitUntil(() => false, 500 * index); // eslint-disable-line no-magic-numbers
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
          }
        }
      }
    });
  }, [currentBusiness, itemsFromBooke]);

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
              <div className={Css.icon}><IconCheck /></div>
              <div className={Css.text}>On the <b>{businessName}</b>, all transactions have been successfully reconciled</div>
            </div>
          );
        }

        return (
          <div className={Css.emptyState}>Has no statements from Booke.ai on this page.</div>
        );
      })()}
    </div>
  );
};

export default CurrentAccount;
