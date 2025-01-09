import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BrokenImage from "../assets/images/notfound.gif"; // Update path as necessary
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
  };

  return (
    <Container
      style={{
        textAlign: "center",
        paddingBottom: "40px",
      }}
    >
      <Helmet>
        <title>Homadil | Not Found</title>
      </Helmet>
      <img
        src={BrokenImage}
        alt="404 - Page Not Found"
        style={{
          maxWidth: "100%",
          width: "100%",
          height: "auto",
          marginBottom: "20px",
        }}
      />
      <Typography variant="h4" color="error" gutterBottom>
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary">
        It seems the page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={goToHome}
        style={{ marginTop: "20px" }}
      >
        Back to Home
      </Button>
    </Container>
  );
}
