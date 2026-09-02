import React from "react";
import ReactDOM from "react-dom/client";

import "normalize.css";
import "./index.css";

import App from "./App/App.jsx";

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
