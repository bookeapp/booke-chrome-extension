import { VIEWS } from "const/Constants";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { uiSlice } from "slices";
import Logo from "./lib/Logo";

const Main = () => {  
  const dispatch = useDispatch();
    
  const handleButtonClick = useCallback(() => {    
    dispatch(uiSlice.actions.setCurrentView(VIEWS.DASHBOARD));
  }, []);
  
  return (
    <div className="Main" onClick={handleButtonClick}>
      <Logo />
    </div>
  );
}

export default Main;
