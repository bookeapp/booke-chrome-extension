import { Provider } from "react-redux";
import App from "App";
import React from "react";
import ReactDom from "react-dom/client";
import store from "store";

const init = () => {
  // eslint-disable-next-line no-console
  console.log("BOOKE AI VERSION:", process.env.APP_VERSION);

  const rooElement = document.createElement("div");

  rooElement.id = "booke-ai-extension";
  document.body.appendChild(rooElement);

  const root = ReactDom.createRoot(rooElement);

  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

try { init(); } catch (error) {}
