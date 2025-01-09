import React, { useContext, useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { Form, FormGroup, FormLabel } from "react-bootstrap"; // Use FormLabel
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import apiRequest from "../../apiRequest";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../store";

export default function UserEdit() {
  const navigator = useNavigate();
  const { backend_url } = useContext(DataContext);
  useEffect(() => {
    getUser();
  }, []);

  function getUser() {
    apiRequest.get("/users/is_logged").then((res) => {
      if (!res) {
        return navigator("/sign_in");
      }

      setUser({
        name: res?.user?.name || "",
        role: res?.user?.role || "",
        profile_image: res?.user?.profile_image || null,
        location: {
          country: res?.user?.location?.country || "",
          state: res?.user?.location?.state || "",
          city: res?.user?.location?.city || "",
          address: res?.user?.location?.address || "",
        },
      });
      setID(res?.user?.id);
    });
  }
  const [user, setUser] = useState({
    name: "",
    role: "",
    profile_image: null,
    location: {
      country: "",
      state: "",
      city: "",
      address: "",
    },
  });
  const [id, setID] = useState(null);

  const form = useRef(null);

  const [loader, setLoader] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      location: {
        ...prevUser.location,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      profile_image: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    setLoader(true);
    e.preventDefault();

    const formData = new FormData();

    // Append other fields
    formData.append("name", user.name);
    formData.append("role", user.role);
    formData.append("country", user.location.country);
    formData.append("state", user.location.state);
    formData.append("files", user.profile_image);
    formData.append("city", user.location.city);
    formData.append("address", user.location.address);

    apiRequest
      .put(`/users/${id}`, formData)
      .then((res) => {
        setUser(res.user);
        form.current?.reset();
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  return (
    <div className="page-content" style={{ padding: "60px 0" }}>
      <Container maxWidth="sm">
        <Box p={3} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Edit User Profile
          </Typography>
          <Form
            onSubmit={handleSubmit}
            ref={form}
            encType="multipart/form-data"
          >
            <FormGroup>
              <FormLabel>Name</FormLabel>
              <TextField
                variant="outlined"
                fullWidth
                name="name"
                value={user.name}
                onChange={handleInputChange}
                placeholder="Enter name"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Role</FormLabel>
              <TextField
                select
                variant="outlined"
                fullWidth
                name="role"
                value={user.role}
                onChange={handleInputChange}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </TextField>
            </FormGroup>

            {user.profile_image ? (
              <img
                style={{ margin: "10px", maxWidth: "100%", maxHeight: "200px" }}
                src={
                  typeof user.profile_image === "string"
                    ? `${backend_url}/${user.profile_image}` // Display URL from database
                    : URL.createObjectURL(user.profile_image) // Display local file preview
                }
                alt="Profile"
              />
            ) : (
              ""
            )}

            <FormGroup style={{ margin: "8px 0" }}>
              <FormLabel>Profile Image</FormLabel>
              <Button
                variant="contained"
                component="label"
                startIcon={<FontAwesomeIcon icon={faUpload} />}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </FormGroup>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Location
            </Typography>
            <FormGroup>
              <FormLabel>Country</FormLabel>
              <TextField
                variant="outlined"
                fullWidth
                name="country"
                value={user.location.country}
                onChange={handleLocationChange}
                placeholder="Enter country"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>State</FormLabel>
              <TextField
                variant="outlined"
                fullWidth
                name="state"
                value={user.location.state}
                onChange={handleLocationChange}
                placeholder="Enter state"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>City</FormLabel>
              <TextField
                variant="outlined"
                fullWidth
                name="city"
                value={user.location.city}
                onChange={handleLocationChange}
                placeholder="Enter city"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>Address</FormLabel>
              <TextField
                variant="outlined"
                fullWidth
                name="address"
                value={user.location.address}
                onChange={handleLocationChange}
                placeholder="Enter address"
              />
            </FormGroup>
            <Grid container justifyContent="center" sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                type="submit"
                disabled={loader} // Disable button when loading
              >
                {loader ? (
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> // Spinner when loading
                ) : (
                  "Save Changes"
                )}
              </Button>
            </Grid>
          </Form>
        </Box>
      </Container>
    </div>
  );
}
