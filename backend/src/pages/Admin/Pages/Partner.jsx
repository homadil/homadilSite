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
export default function Partner() {
  const [partner, setPartner] = useState([]);
  const [loader, setLoader] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backend_url } = useContext(DataContext);
  const [id, setID] = useState(null);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    apiRequest
      .get("/partners")
      .then((res) => setPartner(res))
      .finally(() => setLoader(false));
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    slogan: "",
    image: "",
  });

  // Modal Handlers
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Add Partner
  const handleAddTeam = (formData) => {
    apiRequest
      .post(
        `/partners`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setLoading(false);
        partner.push(res);
        setPartner(partner);
        handleCloseModal();
      })
      .catch((error) => {});
  };

  // Delete Partner
  const handleDeletePartner = (id) => {
    apiRequest
      .delete(`/partners/${id}`)
      .then((res) => {
        const updatedPartner = partner.filter((Partner) => Partner.id !== id);
        setPartner(updatedPartner);
      })
      .finally(() => {});
  };

  // Update Partner (Mock)
  const handleUpdatePartner = (id, formData) => {
    apiRequest
      .put(
        `/partners/${id}`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setLoading(false);
        const updatedPartner = partner.map((item) =>
          item.id === res.id ? (item = res) : item
        );
        setPartner(updatedPartner); // Update the partner state with the updated data
        handleCloseModal(); // Close the modal after successful update
      })
      .catch((error) => {});
  };

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    console.log(newPartner);
    const formData = new FormData();

    formData.append("files", newPartner.image);
    formData.append("slogan", newPartner.slogan);
    formData.append("name", newPartner.name);

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
        <title>Homadil | Admin | Partner</title>
      </Helmet>
      <h3>Partners </h3>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={faPlus} />}
        onClick={() => {
          handleOpenModal();
          setUpdate(false);
          setNewPartner({
            comment: "",
            name: "",
            image: "",
          });
        }}
      >
        Add More
      </Button>

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {partner.map((Partner) => (
          <Grid item xs={12} md={6} key={Partner.id}>
            <Card className="p-3" style={{ position: "relative" }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <img
                    src={backend_url + "/" + Partner.image}
                    alt={Partner.name}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6">{Partner.name}</Typography>
                  <Typography variant="body1">{Partner.slogan}</Typography>

                  <div className="mt-3">
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<FontAwesomeIcon icon={faEdit} />}
                      onClick={() => {
                        setID(Partner.id);
                        handleOpenModal();
                        setUpdate(true);
                        setNewPartner(Partner);
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
                        setID(Partner.id);
                        handleDeletePartner(Partner.id);
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

      {/* Add Partner Modal */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <form
          onSubmit={handleSubmit}
          className="p-4"
          style={modalStyle}
          encType="multipart/form-data"
        >
          <Typography variant="h6">
            {update ? "Update" : "Add"} Partner
          </Typography>
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            required={update ? false : true}
            value={newPartner.name}
            onChange={(e) =>
              setNewPartner({ ...newPartner, name: e.target.value })
            }
            className="mt-3"
          />
          <TextField
            label="Slogan"
            fullWidth
            variant="outlined"
            required={update ? false : true}
            value={newPartner.slogan}
            onChange={(e) =>
              setNewPartner({ ...newPartner, slogan: e.target.value })
            }
            className="mt-3"
          />
          <input
            type="file"
            accept="image/*"
            className="form-control mt-3"
            required={update ? false : true}
            onChange={(e) => {
              setNewPartner({ ...newPartner, image: e.target.files[0] });
            }}
          />

          <Button
            variant="contained"
            color="primary"
            className="mt-4"
            sx={{ mt: 3 }}
            type="submit"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
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
