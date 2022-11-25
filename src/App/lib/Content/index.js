import Css from "./style.module.scss";

import { FIND_MATCHES_INTERVAL, LOGO_IMG_DATA_URI, RECONCILE_PATH, VIEWS } from "const/Constants";
import { getBusinessesData, getCurrentProgress, getCurrentView, getFetchingState, getUserData } from "selectors";
import { log, normalizeId } from "utils";
import { uiSlice } from "slices";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./lib/Dashboard";
import Main from "./lib/Main";
import React, { useCallback, useEffect, useState } from "react";
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

const findMatchedTransactions = () => {
  log("findMatchedTransactions()");
  try {
    const statementLinesNode = document.querySelector("#statementLines");

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
};

const Content = () => {
  const dispatch = useDispatch();

  const checkAuth = !!useSelector(getUserData);

  const [{ accountID: accountId }] = useEnvVars();

  const currentViev = useSelector(getCurrentView);

  const businessesData = useSelector(getBusinessesData);

  const currentProgress = useSelector(getCurrentProgress);

  const fetching = useSelector(getFetchingState);

  const [matchedTransactionsHash, setMatchedTransactionsHash] = useState(null);

  const currentBusiness = location.pathname === RECONCILE_PATH
    && businessesData && businessesData.find(({ xeroAccountId }) => {
    return normalizeId(xeroAccountId) === normalizeId(accountId);
  });

  log({ currentBusiness });

  const inProgress = !!currentProgress;

  const checkTransactions = useCallback(async(hash) => {
    if (!currentBusiness) return;

    try {
      log({ matchedTransactionsHash: hash });

      if (!hash) return;

      const items = JSON.parse(hash);

      log({ items });

      if (!items.length) {
        dispatch(uiSlice.actions.setBookeTransactions([]));

        return;
      }

      dispatch(uiSlice.actions.setFetchingState(true));

      const response = await api.checkStatements({
        transactions: items,
        accountId: currentBusiness.xeroAccountId
      });

      dispatch(uiSlice.actions.setFetchingState(true));

      log({ response });

      if (!response || !response.results || !response.results.length) {
        dispatch(uiSlice.actions.setBookeTransactions([]));

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

      dispatch(uiSlice.actions.setBookeTransactions(fromBooke));
    } catch (exception) {
      log("ERROR getitemsFromBooke", exception);
    }
  }, [currentBusiness, dispatch]);

  useEffect(() => {
    if (!currentBusiness || inProgress || fetching || !checkAuth) return;

    let timeoutId;

    const find = () => {
      const result = findMatchedTransactions();

      setMatchedTransactionsHash(result ? JSON.stringify(result) : null);

      timeoutId = setTimeout(() => {
        find();
      }, (FIND_MATCHES_INTERVAL));
    };

    find();

    // eslint-disable-next-line consistent-return
    return () => clearTimeout(timeoutId);
  }, [checkAuth, inProgress, fetching, currentBusiness]);

  useEffect(() => {
    checkTransactions(matchedTransactionsHash);
  }, [matchedTransactionsHash, checkTransactions, dispatch]);

  if (!businessesData) {
    return (<Main currentBusiness={currentBusiness} />);
  }

  switch (currentViev) {
    case VIEWS.DASHBOARD:
      return (<Dashboard currentBusiness={currentBusiness} />);
    default:
      return (<Main currentBusiness={currentBusiness} />);
  }
};

export default Content;
