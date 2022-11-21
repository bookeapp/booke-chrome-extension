import Css from "./style.module.scss";

import { FIND_MATCHES_INTERVAL, LOGO_IMG_DATA_URI, PROCENTS, RECONCILE_PATH } from "const/Constants";
import { delay, log, normalizeId, runInSequence } from "utils";
import { fetchStats } from "slices";
import { getBusinessesData, getCurrentShortCode } from "selectors";
import { useDispatch, useSelector } from "react-redux";
import Button from "lib/Button";
import EmptyState from "lib/EmptyState";
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

  const [matchedTransactionsHash, setMatchedTransactionsHash] = useState("");

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
    log("findMatchedTransactions()");
    try {
      const statementLinesNode = document.querySelector("#statementLines");

      log("findMatchedTransactions()", { statementLinesNode });

      if (!statementLinesNode) return null;

      const nodes = [...statementLinesNode.querySelectorAll("[data-statementlineid].line")].filter((node) => {
        return !node.classList.contains("no-display");
      });

      log("findMatchedTransactions()", { nodes });

      if (!nodes.length) return null;

      return nodes.map((node) => {
        const detailsContainer = node.querySelector(".statement.matched .details-container");

        if (!detailsContainer) return null;

        const [timestampNode, addressNode, descriptionNode] = detailsContainer.querySelectorAll(".details span");

        const [amounNodeSpent, amountNodeReceived] = detailsContainer.querySelectorAll(".amount");

        const spent = (parseFloat(amounNodeSpent?.textContent?.replace(/,/g, "") || 0));

        const received = (parseFloat(amountNodeReceived?.textContent?.replace(/,/g, "") || 0));

        const amount = spent || received;

        return {
          id: node.id,
          hash: btoa(JSON.stringify({
            addressName: addressNode?.textContent || undefined,
            amount: amount * (spent ? -1 : 1) || undefined,
            description: descriptionNode?.textContent?.replace("Ref: ", "") || undefined,
            timestamp: parseTime(timestampNode?.textContent)
          }))
        };
      }).filter(Boolean);
    } catch (exception) {}

    return null;
  }, []);

  const checkTransactions = useCallback(async(items) => {
    try {
      log({ items });

      if (!items.length) {
        setItemsFromBooke([]);

        return;
      }

      setFetching(true);

      const response = await api.checkStatements({
        transactions: items,
        accountId: currentBusiness.xeroAccountId
      });

      setFetching(false);

      log({ response });

      if (!response || !response.results || !response.results.length) {
        setItemsFromBooke([]);

        return;
      }

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

      log({ fromBooke });

      setItemsFromBooke(fromBooke);
    } catch (exception) {
      log("ERROR getitemsFromBooke", exception);
    }
  }, [currentBusiness]);

  const handleStartClick = useCallback(async() => {
    setCurrentProgress({ value: 0 });

    const result = (await runInSequence(itemsFromBooke.map((item, index) => {
      return async() => {
        await delay(300); // eslint-disable-line no-magic-numbers

        const statement = document.getElementById(item.id);

        if (!statement) return null;

        const button = statement.querySelector(".okayButton");

        if (!button) return null;

        button.removeAttribute("href");

        button.click();

        setCurrentProgress({ value: (index + 1) / itemsFromBooke.length });

        return item;
      };
    }))).filter(Boolean);

    setFetching(true);

    setItemsFromBooke([]);

    if (result.length) {
      await api.reconcileStatements({
        accountId: currentBusiness.xeroAccountId,
        transactions: result
      });
    }

    setCurrentProgress(null);
    await dispatch(fetchStats(currentShortCode));
    setFetching(false);
  }, [currentBusiness, itemsFromBooke, currentShortCode, dispatch]);

  useEffect(() => {
    if (!currentBusiness || inProgress || fetching) return;

    let timeoutId;

    const find = () => {
      const result = findMatchedTransactions();

      setMatchedTransactionsHash(result ? JSON.stringify(result) : "[]");

      timeoutId = setTimeout(() => {
        find();
      }, (FIND_MATCHES_INTERVAL));
    };

    find();

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutId);
  }, [inProgress, fetching, currentBusiness, findMatchedTransactions]);

  useEffect(() => {
    log({ matchedTransactionsHash });
    if (!matchedTransactionsHash) {
      setItemsFromBooke([]);

      return;
    }

    const items = JSON.parse(matchedTransactionsHash);

    log({ items });

    if (!items.length) {
      setItemsFromBooke([]);

      return;
    }

    checkTransactions(items);
  }, [matchedTransactionsHash, checkTransactions]);

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
              disabled={fetching}
              theme="success"
              onClick={handleStartClick}>
              Reconcile Booke.ai transactions
            </Button>
          );
        }

        if (!transactions) {
          return (
            <EmptyState theme="success">No Transactions to reconcile</EmptyState>
          );
        }

        return (
          <EmptyState>Has no Booke.ai statements on this page</EmptyState>
        );
      })()}
    </div>
  );
};

export default CurrentAccount;
