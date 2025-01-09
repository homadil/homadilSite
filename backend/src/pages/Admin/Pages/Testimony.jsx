import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Modal,
  TextField,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import apiRequest from "../../../apiRequest";
import Loader from "../../../components/Loader";
import { DataContext } from "../../../store";
import { Helmet } from "react-helmet-async";
export default function Testimony() {
  const [loader, setLoader] = useState(false);
  const { backend_url, testimonies, setTestimonies } = useContext(DataContext);
  const [id, setID] = useState(null);
  const [update, setUpdate] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [newTestimony, setNewTestimony] = useState({
    comment: "",
    name: "",
    position: "",
    image: "",
  });

  // Modal Handlers
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Add Testimony
  const handleAddTestimony = (formData) => {
    apiRequest
      .post(
        `/testimonies`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setLoader(false);
        testimonies.push(res);
        setTestimonies(testimonies);
        handleCloseModal();
      });
  };

  // Delete Testimony
  const handleDeleteTestimony = (id) => {
    apiRequest
      .delete(`/testimonies/${id}`)
      .then((res) => {
        const updatedTestimonies = testimonies.filter(
          (testimony) => testimony.id !== id
        );
        setTestimonies(updatedTestimonies);
      })
      .finally(() => {});
  };

  // Update Testimony (Mock)
  const handleUpdateTestimony = (id, formData) => {
    apiRequest
      .put(
        `/testimonies/${id}`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        const updatedTestimonies = testimonies.map((item) =>
          item.id === res.id ? (item = res) : item
        );
        setLoader(false);
        setTestimonies(updatedTestimonies); // Update the testimonies state with the updated data
        handleCloseModal(); // Close the modal after successful update
      })
      .catch(() => {});
  };

  function handleSubmit(e) {
    e.preventDefault();
    setLoader(true);
    const formData = new FormData();

    formData.append("files", newTestimony.image);
    formData.append("comment", newTestimony.comment);
    formData.append("name", newTestimony.name);
    formData.append("position", newTestimony.position);

    if (update) {
      handleUpdateTestimony(id, formData);
    } else {
      handleAddTestimony(formData);
    }
  }

  return (
    <div className="container">
      <Helmet>
        <title>Homadil | Admin | Testimony</title>
      </Helmet>
      <h3>Testimonies </h3>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={faPlus} />}
        onClick={() => {
          handleOpenModal();
          setUpdate(false);
          setNewTestimony({
            comment: "",
            name: "",
            position: "",
            image: "",
          });
        }}
      >
        Add More
      </Button>

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {testimonies.map((testimony) => (
          <Grid item xs={12} md={6} key={testimony.id}>
            <Card className="p-3" style={{ position: "relative" }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <img
                    src={backend_url + "/" + testimony.image}
                    alt={testimony.name}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      height: "150px",
                    }}
                  />
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6">{testimony.name}</Typography>
                  <Typography variant="body1">{testimony.position}</Typography>
                  <Typography variant="body2" className="mt-2">
                    {testimony.comment?.substring(0, 300) + "..."}
                  </Typography>
                  <div className="mt-3">
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<FontAwesomeIcon icon={faEdit} />}
                      onClick={() => {
                        setID(testimony.id);
                        handleOpenModal();
                        setUpdate(true);
                        setNewTestimony(testimony);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<FontAwesomeIcon icon={faTrash} />}
                      className="ms-2"
                      onClick={() => {
                        setID(testimony.id);
                        handleDeleteTestimony(testimony.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Testimony Modal */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <form
          onSubmit={handleSubmit}
          className="p-4"
          style={modalStyle}
          encType="multipart/form-data"
        >
          <Typography variant="h6">
            {update ? "Update" : "Add"} Testimony
          </Typography>
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            required={update ? false : true}
            value={newTestimony.name}
            onChange={(e) =>
              setNewTestimony({ ...newTestimony, name: e.target.value })
            }
            className="mt-3"
          />
          <TextField
            label="Position"
            fullWidth
            variant="outlined"
            required={update ? false : true}
            value={newTestimony.position}
            onChange={(e) =>
              setNewTestimony({ ...newTestimony, position: e.target.value })
            }
            className="mt-3"
          />
          <TextField
            label="Comment"
            fullWidth
            multiline
            rows={4}
            required={update ? false : true}
            variant="outlined"
            value={newTestimony.comment}
            onChange={(e) =>
              setNewTestimony({ ...newTestimony, comment: e.target.value })
            }
            className="mt-3"
          />
          <input
            type="file"
            accept="image/*"
            className="form-control mt-3"
            required={update ? false : true}
            onChange={(e) => {
              setNewTestimony({ ...newTestimony, image: e.target.files[0] });
            }}
          />

          <Button
            variant="contained"
            color="primary"
            className="mt-4"
            sx={{ mt: 3 }}
            type="submit"
            disabled={loader} // Disable button when loading
          >
            {loader ? (
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> // Spinner when loading
            ) : !update ? (
              "Submit"
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </Modal>
    </div>
  );
}

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  boxShadow: 24,
  padding: "16px",
  maxWidth: "600px",
  width: "100%",
};
