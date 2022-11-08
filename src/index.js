import { Provider } from "react-redux";
import App from "App";
import React from "react";
import ReactDom from "react-dom/client";
import store from "store";

const init = () => {
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

try { init(); } catch (error) {}
