import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify"; // Assuming you use react-toastify for notifications
import apiRequest from "../../../apiRequest";
import Loader from "../../../components/Loader";
import EstateForm from "../../../components/DataBaseForms/EstateForm";
import { Helmet } from "react-helmet-async";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

const Estate = () => {
  const [estates, setEstates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    country: "",
    state: "",
    city: "",
    address: "",
    estimate: "",
    area: "",
    code: "",
    price_range: "",
    unit_of_land_solid: "",
    director: "",
    amenities: "",
    show: "",
    content: "",
    nearbyLocations: "",
    status: "pending",
    deletePrevMedia: false,
  });
  const [openModal, setOpenModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [currentEstateId, setCurrentEstateId] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState({
    estate: false,
    category: false,
  });

  useEffect(() => {
    setLoading({ ...loading, Estate: true });
    setLoading({ ...loading, category: true });

    fetchEstates();
    fetchCategories();
  }, []);

  const fetchEstates = async () => {
    // Fetch Estates from the backend
    apiRequest
      .get("/estates")
      .then((res) => {
        setEstates(res || []);
      })
      .finally(() => {
        setLoading({ ...loading, Estate: false });
      });
  };

  const fetchCategories = async () => {
    // Fetch categories from the backend
    apiRequest
      .get("/categories")
      .then((res) => {
        setCategories(res);
      })
      .finally(() => {
        setLoading({ ...loading, category: false });
      });
  };

  const handleOpenModal = (estate = false) => {
    setOpenModal(true);
    if (estate) {
      setUpdate(true);
      setCurrentEstateId(estate.id);
      setFormData({
        name: estate?.name || "",
        description: estate?.description || "",
        country: estate?.country || estate?.location?.country || "",
        state: estate?.state || estate?.location?.state || "",
        city: estate?.city || estate?.location?.city || "",
        address: estate?.address || estate?.location?.address || "",
        estimate: estate?.estimate || "",
        area: estate?.area || estate?.location?.area || "",
        price_range: estate?.price_range || "",
        number_of_units: estate.number_of_units || "",
        director: estate.director || "",
        amenities: estate.amenities || "",
        show: estates.show || "",
        content: estate.content || "",
        code: estate.code || "",
        nearbyLocations: estate.nearbyLocations || "",
        status: estate.status || "pending",
        location_id: estate.location_id || null,
        deletePrevMedia: false,
      });
      // Reset selected options
      setSelectedCategories(estate.Categories.map((c) => c.id));
    } else {
      setUpdate(false);
      setCurrentEstateId(null);
      setFormData({
        name: "",
        description: "",
        country: "",
        state: "",
        city: "",
        address: "",
        estimate: "",
        area: "",
        price_range: "",
        director: "",
        amenities: "",
        code: "",
        budget: "",
        show: "",
        number_of_units: 0,
        nearbyLocations: "",
        status: "pending",
        deletePrevMedia: false,
      });
      setSelectedCategories([]);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  function refresh() {
    setFiles([]);
    setSelectedCategories([]);
    setLoader((prev) => ({ ...prev, estates: false }));
    setLoader((prev) => ({ ...prev, category: false }));
  }

  const handleSaveEstate = (e) => {
    e.preventDefault();
    setLoader((prev) => ({ ...prev, estate: true }));

    const newFormData = new FormData();

    // Append file objects
    for (let i = 0; i < files.length; i++) {
      newFormData.append("files", files[i]);
    }

    // Append category objects as JSON strings
    for (let i = 0; i < selectedCategories.length; i++) {
      newFormData.append("categories", JSON.stringify(selectedCategories[i]));
    }

    // Append other fields ensuring data matches validation rules
    newFormData.append("name", formData.name);
    newFormData.append("description", formData.description || "");
    newFormData.append("country", formData.country || "");
    newFormData.append("state", formData.state || "");
    newFormData.append("city", formData.city || "");
    newFormData.append("address", formData.address || "");
    newFormData.append("estimate", parseFloat(formData.estimate) || "");
    newFormData.append("area", formData.area || "");
    newFormData.append("price_range", formData.price_range || "");
    newFormData.append("code", formData.code || "");
    newFormData.append("director", formData.director || "");
    newFormData.append("amenities", formData.amenities || []);
    newFormData.append("show", formData.show || "");
    newFormData.append("nearbyLocations", formData.nearbyLocations || []);
    newFormData.append("status", formData.status || "pending");
    newFormData.append("content", formData.content || "");
    newFormData.append("deletePrevMedia", formData.deletePrevMedia || false);
    newFormData.append(
      "number_of_units",
      parseInt(formData.number_of_units) || 0
    );
    newFormData.append("location_id", parseInt(formData.location_id) || null);

    try {
      if (update) {
        apiRequest
          .put(`/estates/${currentEstateId}`, newFormData)
          .then((res) => {
            refresh();
            handleCloseModal();
            fetchEstates();
            setLoader((prev) => ({ ...prev, estate: false }));
          });
      } else {
        apiRequest.post(`/estates`, newFormData).then(() => {
          refresh();
          handleCloseModal();
          fetchEstates();
          setLoader((prev) => ({ ...prev, estate: false }));
        });
      }
    } catch (error) {
      toast.error("Failed to save Estate");
    }
  };

  const handleDeleteEstate = async (id) => {
    try {
      await apiRequest.delete(`/estates/${id}`);
      fetchEstates(); // Refresh Estate list
    } catch (error) {
      toast.error("Failed to delete Estate");
    }
  };

  if (loading.category || loading.estate || loading.tag || loading.url) {
    <Loader />;
  }

  return (
    <div>
      <Helmet>
        <title>Homadil | Admin | Estate</title>
      </Helmet>

      <Button
        className="m-2"
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
      >
        Add <PlaylistAddIcon className="mx-2" />
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estates.map((estate) => (
              <TableRow key={estate.id}>
                <TableCell>{estate.name}</TableCell>
                <TableCell>{estate.code}</TableCell>
                <TableCell>{estate.area}</TableCell>
                <TableCell>{estate.status}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => handleOpenModal(estate)}
                    startIcon={<FontAwesomeIcon icon={faEdit} />}
                  >
                    Update
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeleteEstate(estate.id)}
                    startIcon={<FontAwesomeIcon icon={faTrash} />}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        style={{ width: "100%", height: "100%" }}
        open={openModal}
        onClose={handleCloseModal}
      >
        <>
          <EstateForm
            update={update}
            formData={formData}
            handleFormChange={handleFormChange}
            setFormData={setFormData}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            categories={categories}
            setFiles={setFiles}
            files={files}
            handleCloseModal={handleCloseModal}
            handleSaveEstate={handleSaveEstate}
            loader={loader}
          />
        </>
      </Modal>
    </div>
  );
};

export default Estate;
