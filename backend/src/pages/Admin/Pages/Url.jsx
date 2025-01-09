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
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
export default function Url() {
  const [urls, setUrls] = useState([]);
  const [loader, setLoader] = useState([]);
  const { backend_url } = useContext(DataContext);
  const [id, setID] = useState(null);
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    apiRequest
      .get("/urls")
      .then((res) => setUrls(res))
      .finally(() => setLoader(false));
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [newUrl, setNewUrl] = useState({
    name: "",
    link: "",
    icon: "",
    image: "",
  });

  // Modal Handlers
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Add Url
  const handleAddTeam = (formData) => {
    apiRequest
      .post(
        `/urls`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        urls.push(res);
        setUrls(urls);
        handleCloseModal();
      });
  };

  // Delete Url
  const handleDeletePartner = (id) => {
    apiRequest
      .delete(`/urls/${id}`)
      .then((res) => {
        const updatedPartner = urls.filter((Url) => Url.id !== id);
        setUrls(updatedPartner);
      })
      .finally(() => {});
  };

  // Update Url (Mock)
  const handleUpdatePartner = (id, formData) => {
    apiRequest
      .put(
        `/urls/${id}`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        const updatedPartner = urls.map((item) =>
          item.id === res.id ? (item = res) : item
        );
        setUrls(updatedPartner); // Update the urls state with the updated data
        handleCloseModal(); // Close the modal after successful update
      });
  };

  function handleSubmit(e) {
    e.preventDefault();
    let checker = newUrl.icon || newUrl.image;
    if (!checker) {
      return toast.error("Icon or Image Must be included");
    }
    const formData = new FormData();

    formData.append("files", newUrl.image);
    formData.append("link", newUrl.link);
    formData.append("icon", newUrl.icon);
    formData.append("name", newUrl.name);

    if (update) {
      handleUpdatePartner(id, formData);
    } else {
      handleAddTeam(formData);
    }
  }

  if (loader) {
    return <Loader />;
  }

  return (
    <div className="container">
      <Helmet>
        <title>Homadil | Admin | URL</title>
      </Helmet>
      <h3>URL </h3>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={faPlus} />}
        onClick={() => {
          handleOpenModal();
          setUpdate(false);
          setNewUrl({
            name: "",
            link: "",
            icon: "",
            image: "",
          });
        }}
      >
        Add More
      </Button>

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {urls.map((url) => (
          <Grid item xs={12} md={6} key={url.id}>
            <Card className="p-3" style={{ position: "relative" }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  {url.image ? (
                    <img
                      src={backend_url + "/" + url.image}
                      alt={url.name}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  ) : (
                    <i
                      className={"fa " + url.icon}
                      style={{ width: "100%", fontSize: "6.25rem" }}
                    ></i>
                  )}
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6">{url.name}</Typography>
                  <Typography variant="body1">{url.link}</Typography>

                  <div className="mt-3">
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<FontAwesomeIcon icon={faEdit} />}
                      onClick={() => {
                        setID(url.id);
                        handleOpenModal();
                        setUpdate(true);
                        setNewUrl(url);
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
                        setID(url.id);
                        handleDeletePartner(url.id);
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

      {/* Add Url Modal */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <form
          onSubmit={handleSubmit}
          className="p-4"
          style={modalStyle}
          encType="multipart/form-data"
        >
          <Typography variant="h6">{update ? "Update" : "Add"} Url</Typography>
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            required={update ? false : true}
            value={newUrl.name}
            onChange={(e) => setNewUrl({ ...newUrl, name: e.target.value })}
            className="mt-3"
          />
          <TextField
            label="Icon"
            fullWidth
            variant="outlined"
            value={newUrl.icon}
            onChange={(e) => setNewUrl({ ...newUrl, icon: e.target.value })}
            className="mt-3"
          />

          <input
            type="url"
            className="form-control mt-3"
            required={update ? false : true}
            placeholder="URL link"
            onChange={(e) => {
              setNewUrl({ ...newUrl, link: e.target.value });
            }}
          />

          <input
            type="file"
            accept="image/*"
            className="form-control mt-3"
            placeholder="Image "
            onChange={(e) => {
              setNewUrl({ ...newUrl, image: e.target.files[0] });
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
