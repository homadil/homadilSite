import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import apiRequest from "../../../apiRequest";
import Loader from "../../../components/Loader";
import { Helmet } from "react-helmet-async";

export default function Tag() {
  const [tags, setTags] = useState([]);
  const [loader, setLoader] = useState([]);
  const [id, setID] = useState(null);
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    apiRequest
      .get("/tags")
      .then((res) => setTags(res))
      .finally(() => setLoader(false));
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [newTag, setNewTag] = useState({
    name: "",
  });

  // Modal Handlers
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Add Tag
  const handleAddTag = (formData) => {
    apiRequest
      .post(
        `/tags`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        tags.push(res);
        setTags(tags);
        handleCloseModal();
      });
  };

  // Delete Tag
  const handleDeleteTeam = (id) => {
    apiRequest
      .delete(`/tags/${id}`)
      .then((res) => {
        const updatedTags = tags.filter((Tag) => Tag.id !== id);
        setTags(updatedTags);
      })
      .finally(() => {});
  };

  // Update Tag (Mock)
  const handleUpdateTag = (id, formData) => {
    apiRequest
      .put(
        `/tags/${id}`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const updatedTags = tags.map((item) =>
          item.id === res.id ? (item = res) : item
        );
        setTags(updatedTags); // Update the tags state with the updated data
        handleCloseModal(); // Close the modal after successful update
      });
  };

  function handleSubmit(e) {
    e.preventDefault();
    const formData = { name: newTag.name };

    if (update) {
      handleUpdateTag(id, formData);
    } else {
      handleAddTag(formData);
    }
  }

  if (loader) {
    return <Loader />;
  }

  return (
    <div className="container">
      <Helmet>
        <title>Homadil | Admin | Tag</title>
      </Helmet>

      <h3>Tags </h3>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={faPlus} />}
        onClick={() => {
          handleOpenModal();
          setUpdate(false);
          setNewTag({
            name: "",
          });
        }}
      >
        Add More
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((Tag) => (
              <TableRow key={Tag.id}>
                <TableCell>
                  <Typography variant="h6">{Tag.name}</Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<FontAwesomeIcon icon={faEdit} />}
                    onClick={() => {
                      setID(Tag.id);
                      handleOpenModal();
                      setUpdate(true);
                      setNewTag(Tag);
                    }}
                    style={{ marginBottom: "4px" }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<FontAwesomeIcon icon={faTrash} />}
                    className="ms-2"
                    onClick={() => {
                      setID(Tag.id);
                      handleDeleteTeam(Tag.id);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Tag Modal */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit} className="p-4" style={modalStyle}>
          <Typography variant="h6">{update ? "Update" : "Add"} Tag</Typography>
          <TextField
            label="Name"
            fullWidth
            variant="outlined"
            required={update ? false : true}
            value={newTag.name}
            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
            className="mt-3"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
          >
            {update ? "Update" : "Add"} Tag
          </Button>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            type="submit"
            className="mt-4"
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
