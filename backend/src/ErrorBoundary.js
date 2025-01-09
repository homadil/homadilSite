import React from "react";
import { toast } from "react-toastify"; // Import toast if you're using react-toastify

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log the error and refresh the page
    toast.error("Something went wrong: " + error.message);

    // Refresh the page after 3 seconds
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. The page will refresh shortly...</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
