import React from "react";
import { useSelector } from "react-redux";
import { getPreloaderState } from "selectors";
import Content from "./lib/Content";
import Preloader from "./lib/Preloader";

const App = () => {  
  const preloaderState = useSelector(getPreloaderState);
  
  return (
    <>
      <Content />
      
      {/* preloaderState && */ (<Preloader absolute />)}
    </>
  );
}

export default App;
