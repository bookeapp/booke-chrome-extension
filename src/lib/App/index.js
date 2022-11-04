import React from "react";
import Main from "lib/Main";
import { useSelector } from "react-redux";
import { getCurrentView, getPreloaderState } from "slices/ui";
import { VIEWS } from "const/Constants";
import Dashboard from "lib/Dachboard";

const App = () => {  
  const preloaderState = useSelector(getPreloaderState);
  
  const currentViev = useSelector(getCurrentView);  
  
  console.log(">>> ", { preloaderState, currentViev });  
  
  switch (currentViev) {
    case VIEWS.DASHBOARD:
      return (<Dashboard />);
    default:
      return (<Main />);
  }  
}

export default App;
