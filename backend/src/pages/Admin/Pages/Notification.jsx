import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Box,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import apiRequest from "../../../apiRequest";
import QuillEditor from "../../../components/QuillEditor";
import NotificationContent from "../../../components/DataBaseForms/NotificationContent";
import { Helmet } from "react-helmet-async";

export default function Notification() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [customEmails, setCustomEmails] = useState("");
  const [sendingEmails, setSendingEmails] = useState([]);
  const [useNotificationContent, setUseNotificationContent] = useState(true);
  const [notificationContent, setNotificationContent] = useState(null); // fetched from backend
  const [getNotificationContents, setGetNotificationContent] = useState([]);
  const [customContent, setCustomContent] = useState("");
  const [selectedCard, setSelectedCard] = useState(null); // Track selected card
  const [loader, setLoader] = useState(false);

  // Fetch users from backend when component mounts
  useEffect(() => {
    apiRequest
      .get("/users")
      .then((response) => {
        setUsers(response);
      })
      .catch((error) => {
        toast.error("Failed to fetch users");
      });

    // Fetch default notification content
    apiRequest
      .get("/notifications")
      .then((response) => {
        setGetNotificationContent(response);
      })
      .catch((error) => {
        toast.error("Failed to fetch notification content");
      });
  }, []);

  // Handle user selection
  const handleUserChange = (event) => {
    setSelectedUsers(event.target.value);
  };

  // Handle custom emails input
  const handleCustomEmailsChange = (event) => {
    setCustomEmails(event.target.value);
  };

  // Combine selected users and custom emails into one array
  const prepareEmails = () => {
    const emailsFromUsers = selectedUsers.map((user) => user.email);
    const customEmailArray = customEmails
      .split(",")
      .map((email) => email.trim());
    setSendingEmails([...emailsFromUsers, ...customEmailArray]);
  };

  // Toggle between using default notification content or custom content
  const toggleContent = () => {
    setUseNotificationContent((prev) => !prev);
  };

  // Submit the notification
  const sendNotification = (e) => {
    e.preventDefault();
    prepareEmails(); // Ensure sendingEmails is up to date

    setLoader(true);

    const dataToSend = {
      emails: sendingEmails,
      content: useNotificationContent ? notificationContent : customContent,
      title: getNotificationContents.filter(
        (notification) => notification.id === selectedCard
      )[0]?.title,
    };

    apiRequest
      .post("/notifications/send", dataToSend)
      .then((response) => {
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        toast.error("Failed to send notification");
      });
  };

  return (
    <form onSubmit={sendNotification}>
      <Helmet>
        <title>Homadil | Admin | Notification</title>
      </Helmet>
      <h2>Send Notification</h2>
      <FormControl fullWidth>
        <InputLabel>Select Users</InputLabel>
        <Select
          multiple
          value={selectedUsers}
          onChange={handleUserChange}
          renderValue={(selected) =>
            selected.map((user) => user.name).join(", ")
          }
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user}>
              {user.name} ({user.email})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Custom Emails (comma-separated)"
        fullWidth
        value={customEmails}
        onChange={handleCustomEmailsChange}
        margin="normal"
      />

      <FormControlLabel
        control={
          <Checkbox checked={useNotificationContent} onChange={toggleContent} />
        }
        label="Use predefined notification content"
      />

      {useNotificationContent ? (
        <NotificationContent
          notificationContent={notificationContent}
          setNotificationContent={setNotificationContent}
          getNotificationContents={getNotificationContents}
          setGetNotificationContent={setGetNotificationContent}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
        />
      ) : (
        <Box sx={{ mt: 2 }}>
          <QuillEditor value={customContent} setValue={setCustomContent} />
        </Box>
      )}

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
          "Send Notification"
        )}
      </Button>
    </form>
  );
}
