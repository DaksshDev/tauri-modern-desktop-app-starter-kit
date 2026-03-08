import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CustomTitleBar from "./window/Titlebar";
import './styles.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="h-screen flex flex-col overflow-hidden">
      <CustomTitleBar />
      <div className="flex-1 h-screen flex flex-col overflow-auto">
        <App />
      </div>
    </div>
  </React.StrictMode>,
);