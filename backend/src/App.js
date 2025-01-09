import "./App.css";
import RouterPath from "./RouterPath";
import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { DataContext } from "./store.js";
import ScrollToTop from "./ScrollToTop.js";

function ScrollToHashElement() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetElement = document.getElementById(hash.substring(1)); // Get the element by ID
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return null; // This component doesn't render anything
}

function pageLoader() {
  const loadingArea = document.querySelector(".loading-area");
  if (loadingArea) {
    loadingArea.style.transition = "opacity 1s ease";
    loadingArea.style.opacity = 0;

    // Remove the element after the transition
    setTimeout(() => {
      loadingArea.style.display = "none";
    }, 1000); // Match the duration with CSS transition time
  }
}

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.includes("/admin");
  const { loaders } = useContext(DataContext);
  // If all values are false, set finishedLoading to true, otherwise false
  const finishedLoading = Object.values(loaders).every(
    (value) => value === false
  );

  useEffect(() => {
    pageLoader();
  }, []);
  return (
    <div className="page-wrapper">
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="bounce"
      />
      {/* Same as */}
      <ToastContainer />

      <RouterPath />

      <ScrollToHashElement />
    </div>
  );
}

export default App;
