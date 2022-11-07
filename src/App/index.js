import { getPreloaderState } from "selectors";
import { useSelector } from "react-redux";
import Content from "./lib/Content";
import Preloader from "./lib/Preloader";
import React from "react";

const App = () => {
  const preloaderState = useSelector(getPreloaderState);

  return (
    <>
      <Content />
      {preloaderState && (<Preloader absolute />)}
    </>
  );
};

export default App;
