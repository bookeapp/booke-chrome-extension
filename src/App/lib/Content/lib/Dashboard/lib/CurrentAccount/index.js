import Css from "./style.module.scss";

import { FIND_MATCHES_INTERVAL, LOGO_IMG_DATA_URI, PROCENTS, RECONCILE_PATH } from "const/Constants";
import { fetchStats } from "slices";
import { getBusinessesData, getCurrentShortCode } from "selectors";
import { log, normalizeId, waitUntil } from "utils";
import { useDispatch, useSelector } from "react-redux";
import Button from "lib/Button";
import IconCheck from "lib/IconCheck";
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
  const dispatch = useDispatch();

  const [{ accountID: accountId }] = useEnvVars();

  const businessesData = useSelector(getBusinessesData);

  const currentShortCode = useSelector(getCurrentShortCode);

  const [matchedTransactionsIdsHash, setMatchedTransactionsIdsHash] = useState("");

  const [currentProgress, setCurrentProgress] = useState(null);

  const [itemsFromBooke, setItemsFromBooke] = useState([]);

  const [fetching, setFetching] = useState(false);

  const inProgress = !!currentProgress;

  const currentBusiness = useMemo(() => {
    return businessesData.find(({ xeroAccountId }) => {
      return normalizeId(xeroAccountId) === normalizeId(accountId);
    });
  }, [accountId, businessesData]);

  const findMatchedTransactions = useCallback(() => {
    try {
      const statementLinesNode = document.querySelector("#statementLines");

      if (!statementLinesNode) return;

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
          id,
          addressName: addressNode?.textContent || undefined,
          amount: amount * (spent ? -1 : 1) || undefined,
          description: descriptionNode?.textContent?.replace("Ref: ", "") || undefined,
          timestamp: parseTime(timestampNode?.textContent)
        };
      }).filter(Boolean);

      if (!items.length) return;

      setFetching(true);

      const response = await api.checkStatements({
        transactions: items,
        accountId: currentBusiness.xeroAccountId
      });

      setFetching(false);

      log({ response });

      if (!response || !response.results || !response.results.length) return;

      const fromBooke = response.results.map((result, index) => {
        if (!result) return null;

        const item = items[index];

        const node = document.getElementById(item.id);

        if (!node) return null;

        const container = node.querySelector(".statement.matched .info.c0");

        if (container) {
          if (!container.classList.contains(Css.container)) {
            container.classList.add(Css.container);
            container.appendChild(
              createElement("div", { className: Css.buttonLogo }, createElement("img", { src: LOGO_IMG_DATA_URI }))
            );
          }
        }

        return item;
      }).filter(Boolean);

      setItemsFromBooke(fromBooke);
    } catch (exception) {
      log("ERROR getitemsFromBooke", exception);
    }
  }, [currentBusiness]);

  const handleStartClick = useCallback(() => {
    setCurrentProgress({ value: 0 });

    itemsFromBooke.forEach(async(item, index) => {
      const statement = document.getElementById(item.id);

      if (statement) {
        const button = statement.querySelector(".okayButton");

        if (button) {
          button.removeAttribute("href");
          await waitUntil(() => false, 500 * index); // eslint-disable-line no-magic-numbers
          button.click();

          setCurrentProgress({ value: (index + 1) / itemsFromBooke.length });
          if (!(itemsFromBooke.length - index - 1)) {
            setFetching(true);
            setItemsFromBooke([]);
            await api.reconcileStatements({
              accountId: currentBusiness.xeroAccountId,
              transactions: itemsFromBooke
            });
            setCurrentProgress(null);
            await dispatch(fetchStats(currentShortCode));
            setFetching(false);
          }
        }
      }
    });
  }, [currentBusiness, itemsFromBooke, currentShortCode, dispatch]);

  useEffect(() => {
    if (!currentBusiness || inProgress || fetching) return;

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
  }, [inProgress, fetching, currentBusiness, findMatchedTransactions]);

  useEffect(() => {
    if (!matchedTransactionsIdsHash) return;

    const ids = JSON.parse(matchedTransactionsIdsHash);

    if (!ids.length) return;

    checkTransactions(ids);
  }, [matchedTransactionsIdsHash, checkTransactions]);

  if (!currentBusiness || location.pathname !== RECONCILE_PATH) return null;

  const { name: businessName, transactions } = currentBusiness;

  return (
    <div className={Css.currentAccount}>
      <div className={Css.header}>
        <div className={Css.name}>{businessName}</div>
        {!!transactions && (
          <div className={Css.count}>{`${itemsFromBooke.length}/${transactions} transactions`}</div>
        )}
      </div>
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

        if (itemsFromBooke.length) {
          return (
            <Button
              block
              theme="success"
              onClick={handleStartClick}>
              Reconcile Booke.ai transactions
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
          <div className={Css.emptyState}>Has no Booke.ai statements on this page</div>
        );
      })()}
    </div>
  );
};

export default CurrentAccount;
