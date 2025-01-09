import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Modal,
  TextField,
  Grid,
  Typography,
  InputLabel,
  Select,
  Chip,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import apiRequest from "../../../apiRequest";
import Loader from "../../../components/Loader";
import { DataContext } from "../../../store";
import { Helmet } from "react-helmet-async";

export default function Team() {
  const [teams, setTeams] = useState([]);

  const [loader, setLoader] = useState({
    team: false,
    url: false,
  });
  const { backend_url } = useContext(DataContext);
  const [id, setID] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    position: "",
    image: "",
  });
  const [update, setUpdate] = useState(false);
  const [urls, setUrls] = useState([]);
  const [selectedUrls, setSelectedUrls] = useState(
    update ? newTeam.Urls.map((u) => u.id) : []
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoader({ team: true, url: true });

    fetchTeams();
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    // Fetch URLs from the backend
    apiRequest
      .get("/urls")
      .then((res) => {
        setUrls(res);
      })
      .finally(() => setLoader({ ...loader, url: false }));
  };

  const fetchTeams = async () => {
    apiRequest
      .get("/teams")
      .then((res) => setTeams(res))
      .finally(() => setLoader({ ...loader, team: false }));
  };

  // Modal Handlers
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Add Team
  const handleAddTeam = (formData) => {
    apiRequest
      .post(
        `/teams`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        teams.push(res);
        setTeams(teams);
        setLoading(false);
        handleCloseModal();
      })
      .finally(() => {
        fetchTeams();
      });
  };

  // Delete Team
  const handleDeleteTeam = (id) => {
    apiRequest
      .delete(`/teams/${id}`)
      .then((res) => {
        const updatedTestimonies = teams.filter((Team) => Team.id !== id);
        setTeams(updatedTestimonies);
      })
      .finally(() => {
        fetchTeams();
      });
  };

  // Update Team (Mock)
  const handleUpdateTeam = (id, formData) => {
    apiRequest
      .put(
        `/teams/${id}`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        const updatedTestimonies = teams.map((item) =>
          item.id === res.id ? (item = res) : item
        );
        setLoading(false);
        setTeams(updatedTestimonies); // Update the teams state with the updated data
        handleCloseModal(); // Close the modal after successful update
      })
      .finally(() => {
        fetchTeams();
      });
  };

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    formData.append("files", newTeam.image);
    formData.append("comment", newTeam.comment);
    formData.append("name", newTeam.name);
    formData.append("position", newTeam.position);

    for (let i = 0; i < selectedUrls.length; i++) {
      formData.append("urls", JSON.stringify(selectedUrls[i])); // Stringify the URL objects
    }

    if (update) {
      handleUpdateTeam(id, formData);
    } else {
      handleAddTeam(formData);
    }
  }

  if (loader.team || loader.url) {
    return <Loader />;
  }

  return (
    <div className="container">
      <Helmet>
        <title>Homadil | Admin | Team</title>
      </Helmet>
      <h3>Teams </h3>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={faPlus} />}
        onClick={() => {
          handleOpenModal();
          setUpdate(false);
          setNewTeam({
            comment: "",
            name: "",
            image: "",
          });
        }}
      >
        Add More
      </Button>

      <Grid container spacing={2} style={{ marginTop: "20px" }}>
        {teams.map((Team) => (
          <Grid item xs={12} md={6} key={Team.id}>
            <Card className="p-3" style={{ position: "relative" }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <img
                    src={backend_url + "/" + Team.image}
                    alt={Team.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "8px",
                    }}
                  />
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6">{Team.name}</Typography>
                  <Typography variant="body1">{Team.position}</Typography>

                  <div className="mt-3">
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<FontAwesomeIcon icon={faEdit} />}
                      onClick={() => {
                        setID(Team.id);
                        handleOpenModal();
                        setUpdate(true);
                        setNewTeam(Team);
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
                        setID(Team.id);
                        handleDeleteTeam(Team.id);
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

      {/* Add Team Modal */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <form
          onSubmit={handleSubmit}
          className="p-4"
          style={modalStyle}
          encType="multipart/form-data"
        >
          <Typography variant="h6">{update ? "Update" : "Add"} Team</Typography>
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            required={update ? false : true}
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            className="mt-3"
          />

          <TextField
            label="Position"
            fullWidth
            variant="outlined"
            required={update ? false : true}
            value={newTeam.position}
            onChange={(e) =>
              setNewTeam({ ...newTeam, position: e.target.value })
            }
            className="mt-3"
          />

          <FormControl fullWidth>
            <InputLabel>URLs</InputLabel>
            <Select
              multiple
              style={{ margin: "6px" }}
              value={selectedUrls}
              onChange={(e) => setSelectedUrls(e.target.value)}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={urls.find((url) => url.id === value)?.name}
                    />
                  ))}
                </div>
              )}
            >
              {urls.map((url) => (
                <MenuItem key={url.id} value={url.id}>
                  {url.name} {`{ ${url.link}}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <input
            type="file"
            accept="image/*"
            className="form-control mt-3"
            required={update ? false : true}
            onChange={(e) => {
              setNewTeam({ ...newTeam, image: e.target.files[0] });
            }}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            type="submit"
            className="mt-4"
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
