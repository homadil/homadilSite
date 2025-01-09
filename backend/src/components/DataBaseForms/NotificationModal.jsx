import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import apiRequest from "../../apiRequest";
import { toast } from "react-toastify";

export default function NotificationModal({
  open,
  handleClose,
  notification,
  isUpdate,
  id,
  setGetNotificationContent,
}) {
  const [formData, setFormDate] = useState({
    title: "",
    description: "",
    content: "",
  });
  const [loader, setLoader] = useState(false);

  // Effect to set the fields if it's an update
  useEffect(() => {
    if (isUpdate && notification) {
      setFormDate({
        ...formData,
        title: notification.title,
        description: notification.description,
        content: notification.content,
      });
    } else {
      // Reset fields when modal opens for a new notification
      setFormDate({
        title: "",
        description: "",
        content: "",
      });
    }
  }, [open, isUpdate, notification]);

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.content) {
      toast.error("Please Complete the input fields");
    }
    setLoader(true);

    if (isUpdate) {
      try {
        const res = await apiRequest.put(`/notifications/${id}`, formData);
        // Close loader and modal, then update list
        setLoader(false);
        handleClose();
        // Update the existing notification in the list by mapping over it
        setGetNotificationContent((prev) =>
          prev.map((item) => (item.id === id ? res.notification : item))
        );
      } finally {
        setLoader(false);
      }
    } else {
      try {
        const res_1 = await apiRequest.post(`/notifications`, formData);
        setLoader(false);
        handleClose();
        // Add new notification to the beginning of the list
        setGetNotificationContent((prev_1) => [res_1.notification, ...prev_1]);
      } finally {
        setLoader(false);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <div action="">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {isUpdate ? "Update Notification" : "Create Notification"}
          </Typography>

          <TextField
            label="Title"
            fullWidth
            value={formData.title}
            onChange={(e) =>
              setFormDate({ ...formData, title: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            value={formData.description}
            onChange={(e) =>
              setFormDate({ ...formData, description: e.target.value })
            }
            margin="normal"
          />

          <TextField
            label="Content"
            fullWidth
            multiline
            rows={4} // Adjust the number of rows to control textarea height
            value={formData.content}
            onChange={(e) =>
              setFormDate({ ...formData, content: e.target.value })
            }
            margin="normal"
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            type="submit"
            onClick={handleSave}
            disabled={loader} // Disable button when loading
          >
            {loader ? (
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> // Spinner when loading
            ) : isUpdate ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
