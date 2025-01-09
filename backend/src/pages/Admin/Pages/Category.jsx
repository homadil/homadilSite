import React, { useContext, useEffect, useState } from "react";
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
import { Helmet } from "react-helmet-async";
import { DataContext } from "../../../store";
import Loader from "../../../components/Loader";

export default function Category() {
  const [loading, setLoading] = useState(false);
  const [id, setID] = useState(null);
  const [update, setUpdate] = useState(false);
  const { categories, setCategories } = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
  });

  // Modal Handlers
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Add Tag
  const handleAddCategory = (formData) => {
    apiRequest
      .post(
        `/Categories`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setLoading(false);
        categories.push(res);
        setCategories(categories);
        handleCloseModal();
      })
      .catch(() => {});
  };

  // Delete Tag
  const handleDeleteTeam = (id) => {
    apiRequest
      .delete(`/categories/${id}`)
      .then((res) => {
        const updatedTags = categories.filter((Tag) => Tag.id !== id);
        setCategories(updatedTags);
      })
      .finally(() => {});
  };

  // Update Tag (Mock)
  const handleUpdateTag = (id, formData) => {
    apiRequest
      .put(
        `/categories/${id}`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const updatedTags = categories.map((item) =>
          item.id === res.id ? (item = res) : item
        );
        setLoading(false);
        setCategories(updatedTags); // Update the Categories state with the updated data
        handleCloseModal(); // Close the modal after successful update
      })
      .catch(() => {});
  };

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = {
      name: newCategory.name,
      description: newCategory.description,
      icon: newCategory.icon,
    };

    if (update) {
      handleUpdateTag(id, formData);
    } else {
      handleAddCategory(formData);
    }
  }

  return (
    <div className="container">
      <Helmet>
        <title>Homadil | Admin | Category</title>
      </Helmet>
      <h3>Categories </h3>
      <Button
        variant="contained"
        color="primary"
        startIcon={<FontAwesomeIcon icon={faPlus} />}
        onClick={() => {
          handleOpenModal();
          setUpdate(false);
          setNewCategory({
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
              <TableCell>Description</TableCell>
              <TableCell>Icon</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((Tag) => (
              <TableRow key={Tag.id}>
                <TableCell>
                  <Typography variant="h6">{Tag.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{Tag.description}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">{Tag.icon}</Typography>
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
                      setNewCategory(Tag);
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
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            className="mt-3"
          />

          <TextField
            label="Description"
            fullWidth
            variant="outlined"
            required={update ? false : true}
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            className="mt-3"
          />

          <TextField
            label="Icon"
            fullWidth
            variant="outlined"
            required={update ? false : true}
            value={newCategory.icon}
            onChange={(e) =>
              setNewCategory({ ...newCategory, icon: e.target.value })
            }
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
            className="mt-4"
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
