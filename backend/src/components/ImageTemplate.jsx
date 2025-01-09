import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPencilSquare } from "@fortawesome/free-solid-svg-icons";
import apiRequest from "../apiRequest";
import MediaForm from "./DataBaseForms/MediaForm";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxHeight: "90vh", // Restrict the height to 90% of the viewport height
  overflowY: "auto", // Enable vertical scroll when content overflows
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
export default function ImageTemplate({
  data,
  header,
  type,
  medias,
  setMedias,
  updateFilteredMedia,
}) {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [openModal, setOpenModal] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [previewContent, setPreviewContent] = React.useState("");
  const [isVideo, setIsVideo] = React.useState(false);
  const [id, setID] = React.useState(null);

  //single updated media
  const [media, setMedia] = React.useState({});

  //manage update or delete
  const [usageToggle, setUsageToggle] = React.useState(true);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleContentClick = (item) => {
    setIsVideo(item.exe === "video");
    setPreviewContent(item);
    setOpenPreview(true);
  };
  const backend_domain = process.env.REACT_APP_BACKEND_URL + "/";

  const handleClosePreview = () => setOpenPreview(false);

  function handleDelete(event) {
    const id = event.currentTarget.getAttribute("data-id");

    apiRequest
      .delete(`/medias/${id}`)
      .then((res) => {
        setMedias((prevData) =>
          prevData.filter((item) => item.id !== parseInt(id))
        );
        updateFilteredMedia(medias.filter((item) => item.id !== parseInt(id))); // Update filtered states after deletion
      })
      .catch((error) => {
        console.error("Error deleting media:", error);
      });
  }

  function handleUpdate(event) {
    setUsageToggle(false);
    const id = event.currentTarget.getAttribute("data-id");
    const media = medias.filter((item) => item.id === parseInt(id))[0];
    setID(id);
    setMedia(media);
    handleOpenModal();
  }

  function handleCreate(data) {
    // Update the medias state by combining previous data with new data
    setMedias((prevData) => {
      const updatedMedias = [...prevData, ...data]; // Create a new array with both previous and new data
      updateFilteredMedia(updatedMedias); // Update filtered media based on the new combined array
      return updatedMedias; // Return the updated array for state
    });
  }

  function handlePut(data) {
    setMedias((prevData) => {
      // Filter out the existing media with the given ID
      const updatedMedias = prevData.filter((item) => item.id !== parseInt(id));

      // Add the new media data (which is an object) to the updated array
      updatedMedias.push(data);

      // Update the filtered media based on the new combined array
      updateFilteredMedia(updatedMedias);

      // Return the updated array for state
      return updatedMedias;
    });
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ImageList
        sx={{ width: "100%", height: "auto" }}
        cols={isSmallScreen ? 1 : 3}
        gap={8}
      >
        <ImageListItem key="Subheader" cols={isSmallScreen ? 1 : 3}>
          <ListSubheader component="div">
            <div className="d-flex justify-content-evenly align-items-center">
              {header}
              <Button
                onClick={() => {
                  handleOpenModal();
                  setUsageToggle(true);
                }}
                className="btn-primary h-50"
              >
                Add
              </Button>
            </div>
          </ListSubheader>
        </ImageListItem>
        {data.map((item) => {
          return (
            <ImageListItem key={item.path}>
              {item.exe === "image" ? (
                <img
                  srcSet={`${
                    backend_domain + item.path
                  }?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${
                    backend_domain + item.path
                  }?w=248&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                  style={{ width: "100%", height: "200px", cursor: "pointer" }}
                  onClick={() => handleContentClick(item)}
                />
              ) : (
                <video
                  style={{ width: "100%", height: "auto", cursor: "pointer" }}
                  onClick={() => handleContentClick(item)}
                  controls
                >
                  <source src={backend_domain + item.path} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              <ImageListItemBar
                title={item.parentData?.title}
                subtitle={item.parentData?.description}
                actionIcon={
                  <IconButton
                    sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                    aria-label={`info about ${item.parentData?.title}`}
                    className="d-flex gap-3"
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: "red" }}
                      data-id={item.id}
                      onClick={handleDelete}
                    />
                    <FontAwesomeIcon
                      icon={faPencilSquare}
                      style={{ color: "green" }}
                      data-id={item.id}
                      onClick={handleUpdate}
                    />
                  </IconButton>
                }
              />
            </ImageListItem>
          );
        })}
      </ImageList>

      {/* Add Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          {/* Form or Content for Add Modal */}
          <MediaForm
            type={type}
            usageToggle={usageToggle}
            media={media}
            handlePushCreate={handleCreate}
            handlePutCreate={handlePut}
            handleCloseModal={handleCloseModal}
          />
          <Button onClick={handleCloseModal} variant="danger">
            Close
          </Button>
        </Box>
      </Modal>

      {/* Preview Modal */}
      <Modal open={openPreview} onClose={handleClosePreview}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {isVideo ? (
            <video style={{ width: "100%", height: "500" }} controls>
              <source src={backend_domain + previewContent} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={backend_domain + previewContent.path}
              alt="Preview"
              style={{ width: "100%", height: "500px" }}
            />
          )}
          <IconButton
            sx={{ color: "rgba(255, 255, 255, 0.54)" }}
            aria-label={`info about ${previewContent.parentData?.title}`}
            className="d-flex gap-3"
          >
            <FontAwesomeIcon
              icon={faTrash}
              style={{ color: "red" }}
              data-id={previewContent.id}
              onClick={handleDelete}
            />
            <FontAwesomeIcon
              icon={faPencilSquare}
              style={{ color: "green" }}
              data-id={previewContent.id}
              onClick={handleUpdate}
            />
          </IconButton>
          <Button onClick={handleClosePreview} style={{ marginTop: "10px" }}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
