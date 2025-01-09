import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { Button, Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo_with_black.png";
import apiRequest from "../../apiRequest";
import bg from "../../assets/images/dummy/download_8.jpg";
import { Helmet } from "react-helmet-async";
export default function ForgetPassword() {
  const [isHovered, setIsHovered] = useState(false);
  const handleHover = () => setIsHovered(!isHovered);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    function reDirect(res, ifAdmin, ifNotAdmin) {
      if (res.user.role === "admin") {
        navigate(ifAdmin); // Navigate to the admin page
      } else {
        // Go back to the previous page or navigate to home if no previous page
        if (window.history.length > 1) {
          window.history.back();
        } else {
          navigate(ifNotAdmin); // Navigate to home if no previous page
        }
      }
    }

    apiRequest
      .post("/auth/forget_password", formData)
      .then((res) => {
        // Set loading to true when the request starts
        setLoading(false);
        setTimeout(() => {
          reDirect(res, "/sign_in", "/sign_in");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        setLoading(false); // Ensure loading is set to false on error as well
        // Handle error (e.g., show a notification)
      });
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  return (
    <Container fluid className="p-0">
      <Helmet>
        <title>Homadil | Auth | Forgotten Password</title>
      </Helmet>
      <Row className="min-vh-100 align-items-center">
        {/* Image Section - hidden on mobile */}
        <Col md={6} className="d-none d-md-block">
          <div
            className=""
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: "1000",
              height: "100vh",
              width: "maxContent",

              borderRadius: "10px",
            }}
          ></div>
        </Col>

        {/* Form Section */}
        <Col xs={12} md={6} className="p-5 d-flex justify-content-center">
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              p: 3,
              backgroundColor: "#ffffff",
              borderRadius: 2,
              boxShadow: 3,
              transition: "transform 0.3s ease",
              transform: isHovered ? "translateY(-10px)" : "translateY(0)",
            }}
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
          >
            {/* Space for Logo */}
            <Typography
              variant="h4"
              component="div"
              gutterBottom
              align="center"
              sx={{ fontWeight: "bold", marginBottom: 2 }}
            >
              <img src={logo} alt="" height={100} />
            </Typography>

            <Form onSubmit={handleSubmit}>
              {/* Email Input */}
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <div className="d-flex align-items-center">
                  <div style={{ width: "10%" }}>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div style={{ width: "90%" }}>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      required
                      className="py-2"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </Form.Group>

              {/* Forgot Password and Signup Links */}
              <Row className="mb-3">
                <Col xs={12} className="text-end">
                  <a href="/sign_up" className="text-secondary">
                    Sign in
                  </a>
                </Col>
              </Row>

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2"
                style={{
                  backgroundColor: "#000000",
                  border: "none",
                }}
                disabled={loading} // Disable the button when loading is true
              >
                {loading ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      style={{ marginRight: "5px" }} // Add some space between spinner and text
                    />
                    Loading...
                  </>
                ) : (
                  "Send Request"
                )}
              </Button>
            </Form>
          </Box>
        </Col>
      </Row>
    </Container>
  );
}
