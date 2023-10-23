import React, { Suspense } from "react";

import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/app/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>
);
