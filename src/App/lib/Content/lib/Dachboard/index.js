import Css from "./style.module.scss";

import React from "react";
import { useSelector } from "react-redux";
import { getBusinesses } from "selectors";
import LogoFull from "./lib/LogoFull";

const Dashboard = () => {
  const businesses = useSelector(getBusinesses);
  
  console.log(">>> businesses", Css);
  
  return (
    <div  className="Dashboard">
      <div className="header">
        <div className="logo"><LogoFull /></div>
        <div></div>
      </div>
    </div>
  );
};

export default Dashboard;