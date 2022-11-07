import Css from "./style.module.scss";

import { getPreloaderState } from "selectors";
import { useSelector } from "react-redux";
import Content from "./lib/Content";
import React from "react";
import Preloader from "lib/Preloader";

const App = () => {
  const preloaderState = useSelector(getPreloaderState);

  return (
    <div className={Css.root}>
      <Content />
      {preloaderState && (<Preloader absolute />)}
    </div>
  );
};

export default App;
