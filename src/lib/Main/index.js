import { VIEWS } from "const/Constants";
import Logo from "lib/Logo";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import ui from "slices/ui";

const Main = () => {  
  const dispatch = useDispatch();
    
  const handleButtonClick = useCallback(() => {    
    dispatch(ui.actions.setCurrentView(VIEWS.DASHBOARD));
  }, []);
  
  return (
    <div className="Main" onClick={handleButtonClick}>
      <Logo />
    </div>
  );
}

export default Main;
