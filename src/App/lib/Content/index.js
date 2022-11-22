import { VIEWS } from "const/Constants";
import { getBusinessesData, getCurrentView } from "selectors";
import { useSelector } from "react-redux";
import Dashboard from "./lib/Dashboard";
import Main from "./lib/Main";
import React from "react";

const Content = () => {
  const currentViev = useSelector(getCurrentView);

  const businessesData = useSelector(getBusinessesData);

  if (!businessesData) {
    return (<Main />);
  }

  switch (currentViev) {
    case VIEWS.DASHBOARD:
      return (<Dashboard />);
    default:
      return (<Main />);
  }
};

export default Content;
