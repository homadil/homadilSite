import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import NotificationModal from "./NotificationModal";
import ReactPaginate from "react-js-pagination";
import { toast } from "react-toastify";
import apiRequest from "../../apiRequest";

export default function NotificationContent({
  notificationContent,
  setNotificationContent,
  getNotificationContents,
  setGetNotificationContent,
  selectedCard,
  setSelectedCard,
}) {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [filteredNotifications, setFilteredNotifications] = useState(
    getNotificationContents
  );
  const [searchWord, setSearchWord] = useState("");
  const [editContent, setEditContent] = useState({
    search: "",
    replace: "",
  });
  const [index, setIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchWord(value);

    const filtered = getNotificationContents.filter((notification) =>
      notification.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredNotifications(filtered);
    setCurrentPage(1);
  };
  const notification = getNotificationContents.filter(
    (notification) => notification.id == selectedCard
  );

  // Handle search and replace
  const handleSearchAndReplace = () => {
    console.log(notificationContent);
    if (!editContent.search || !editContent.replace) {
      return toast.error("Input search and replace keywords");
    }

    if (typeof notificationContent === "string") {
      if (!notificationContent.includes(editContent.search)) {
        return toast.error("Search word not found in the content.");
      }

      const updatedContent = notificationContent.replaceAll(
        editContent.search,
        editContent.replace
      );

      if (updatedContent !== notificationContent) {
        setNotificationContent(updatedContent);

        const updatedNotifications = [...getNotificationContents];
        updatedNotifications[index] = {
          ...updatedNotifications[index],
          content: updatedContent,
        };
        setGetNotificationContent(updatedNotifications);

        toast.success("Content updated successfully.");
      } else {
        toast.error("No changes made to the content.");
      }
    } else {
      toast.error("Notification content is not a string.");
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  // Get current notifications to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = filteredNotifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Function to handle pagination change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Function to handle preview (open in new tab)
  const handlePreview = (content, index) => {
    const newWindow = window.open();
    newWindow.document.write(
      `<html><body><pre>${getNotificationContents[index].content}</pre></body></html>`
    );

    newWindow.document.close();
  };

  // Function to toggle modal visibility
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const displayContent =
    currentNotifications.length > 0 || searchWord
      ? currentNotifications
      : getNotificationContents;

  return (
    <div>
      <h3 className="d-flex justify-content-evenly align-content-center">
        <div>Notification Content</div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsUpdate(false);
            handleOpenModal();
          }}
        >
          Add
        </Button>
      </h3>
      <TextField
        label="Search by Title"
        fullWidth
        value={searchWord}
        onChange={handleSearch}
        margin="normal"
      />

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
      >
        {displayContent.map((notification, index) => (
          <Card
            key={index}
            onClick={() => {
              setNotificationContent(notification.content);
              setSelectedCard(notification.id);
              setIndex(index);
            }}
            onDoubleClick={() => handlePreview(notification.content, index)}
            style={{
              cursor: "pointer",
              border:
                selectedCard === notification.id
                  ? "2px solid #1976d2"
                  : "1px solid #ccc",
            }}
          >
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                {notification.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {notification.description.substring(0, 100)}...
              </Typography>

              {/* Delete Button */}
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  apiRequest
                    .delete(`/notifications/${notification.id}`)
                    .then((res) => {
                      setGetNotificationContent((prev) =>
                        prev.filter((item) => item.id !== notification.id)
                      );
                      toast.success("Notification deleted successfully.");
                    })
                    .catch(() => {
                      toast.error("Failed to delete notification.");
                    });
                }}
                style={{ marginTop: "10px" }}
              >
                Delete
              </Button>

              {/* Update Button */}
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal();
                  setIsUpdate(true);
                  setSelectedCard(notification.id);
                }}
                style={{ marginLeft: "10px", marginTop: "10px" }}
              >
                Update
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Component */}
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <ReactPaginate
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={filteredNotifications.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
          firstLabel={"First"}
          lastLabel={"Last"}
          prevLabel={"Prev"}
          nextLabel={"Next"}
        />
      </div>

      {/* Search and Replace Functionality */}
      {notificationContent && (
        <div style={{ marginTop: "20px" }}>
          <TextField
            label="Search Word"
            fullWidth
            value={editContent.search}
            onChange={(e) =>
              setEditContent({ ...editContent, search: e.target.value })
            }
            margin="normal"
          />
          <TextField
            label="Replace With"
            fullWidth
            value={editContent.replace}
            onChange={(e) =>
              setEditContent({ ...editContent, replace: e.target.value })
            }
            margin="normal"
          />
          <Button variant="outlined" onClick={handleSearchAndReplace}>
            Search & Replace
          </Button>
        </div>
      )}

      <NotificationModal
        open={openModal}
        id={selectedCard}
        handleClose={handleCloseModal}
        notification={notification[0]}
        isUpdate={isUpdate}
        setGetNotificationContent={setGetNotificationContent}
      />
    </div>
  );
}
