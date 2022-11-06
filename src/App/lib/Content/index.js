import React from "react";
import { VIEWS } from "const/Constants";
import Dashboard from "./lib/Dachboard";
import Main from "./lib/Main";
import { useSelector } from "react-redux";
import { getCurrentView } from "selectors";

const Content = () => {  
  const currentViev = useSelector(getCurrentView);  
  
  switch (currentViev) {
    case VIEWS.DASHBOARD:
      return (<Dashboard />);
    default:
      return (<Main />);
  }  
};

export default Content;