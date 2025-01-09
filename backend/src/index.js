import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import "./assets/css/style.css"; // Uncomment if you want to include this
import { DataProvider } from "./store";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./ErrorBoundary";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import "./assets/javascript/custom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <ErrorBoundary> */}
    <BrowserRouter>
      <HelmetProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </HelmetProvider>
    </BrowserRouter>
    {/* </ErrorBoundary> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
