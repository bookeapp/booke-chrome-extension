import "./style.scss";

import React from "react";
import ReactDom from "react-dom/client";
import { Provider } from "react-redux";
import store from "store";
import App from "App";

const init = async () => {  
  const rooElement = document.createElement("div");
  rooElement.id = "booke-extension";
  document.body.appendChild(rooElement);
  const root = ReactDom.createRoot(rooElement);
  root.render(         
    <Provider store={store}>
      <App />
    </Provider>
  );
};

try { init() } catch (error) {}
