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
  TextField,
  Select,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify"; // Assuming you use react-toastify for notifications
import apiRequest from "../../../apiRequest";
import Loader from "../../../components/Loader";
import ProjectForm from "../../../components/DataBaseForms/ProjectForm";
import { Helmet } from "react-helmet-async";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [estates, setEstate] = useState([]);
  const [urls, setUrls] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedUrls, setSelectedUrls] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    plot: "",
    description: "",
    content: "",
    start_date: "",
    end_date: "",
    client: "",
    director: "",
    location_id: null,
    budget: "",
    show: "",
    country: "",
    state: "",
    city: "",
    estate: null,
    room_count: 0,
    address: "",
    status: "Carcass",
    deletePrevMedia: false,
  });
  const [openModal, setOpenModal] = useState(false);
  let [update, setUpdate] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState({
    project: false,
    category: false,
    url: false,
    tag: false,
    estate: false,
  });

  useEffect(() => {
    setLoading({ ...loading, project: true });
    setLoading({ ...loading, category: true });
    setLoading({ ...loading, url: true });
    setLoading({ ...loading, tag: true });
    setLoading({ ...loading, estate: true });

    fetchProjects();
    fetchCategories();
    fetchUrls();
    fetchTags();
    fetchEstate();
  }, []);

  const fetchProjects = async () => {
    // Fetch projects from the backend
    apiRequest
      .get("/projects")
      .then((res) => {
        setProjects(res);
      })
      .finally(() => {
        setLoading({ ...loading, project: false });
      });
  };

  const fetchEstate = async () => {
    // Fetch projects from the backend
    apiRequest
      .get("/estates")
      .then((res) => {
        setEstate(res);
      })
      .finally(() => {
        setLoading({ ...loading, estate: false });
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

  const fetchUrls = async () => {
    // Fetch URLs from the backend
    apiRequest
      .get("/urls")
      .then((res) => {
        setUrls(res);
      })
      .finally(() => {
        setLoading({ ...loading, url: false });
      });
  };

  const fetchTags = async () => {
    // Fetch tags from the backend
    apiRequest
      .get("/tags")
      .then((res) => {
        setTags(res);
      })
      .finally(() => {
        setLoading({ ...loading, tag: false });
      });
  };

  const handleOpenModal = (project = false) => {
    setOpenModal(true);
    console.log(typeof project);
    if (project) {
      console.log("it worked");
      setUpdate(true);
      setCurrentProjectId(project.id);
      setFormData({
        plot: project.plot,
        description: project.description,
        content: project.content,
        start_date: new Date(project.start_date).toISOString().split("T")[0],
        end_date: new Date(project.end_date).toISOString().split("T")[0],
        client: project.client,
        director: project.director,
        location_id: project.location_id,
        budget: project.budget,
        country: project.location.country,
        state: project.location.state,
        city: project.location.city,
        address: project.location.address,
        room_count: project.room_count,
        estate: project?.estate?.id,
        status: project.status,
      });
      // Reset selected options
      setSelectedCategories(project.Categories.map((c) => c.id));
      setSelectedUrls(project.Urls.map((u) => u.id));
      setSelectedTags(project.Tags.map((t) => t.id));
    } else {
      setUpdate(false);
      setCurrentProjectId(null);
      setFormData({
        plot: "",
        description: "",
        content: "",
        start_date: "",
        end_date: "",
        client: "",
        director: "",
        location_id: null,
        budget: "",
        country: "",
        state: "",
        city: "",
        address: "",
        room_count: "",
        estate: "",
        status: "",
      });
      setSelectedCategories([]);
      setSelectedUrls([]);
      setSelectedTags([]);
      setFormData({ ...formData, estate: "" });
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
    setSelectedTags([]);
    setSelectedUrls([]);
    setLoader(false);
    setFormData({ ...formData, estate: "" });
  }

  const handleSaveProject = (e) => {
    e.preventDefault();
    setLoader(true);

    const newFormData = new FormData();

    // Append file objects
    for (let i = 0; i < files.length; i++) {
      newFormData.append("files", files[i]);
    }

    // Append URL objects as JSON strings
    for (let i = 0; i < selectedUrls.length; i++) {
      newFormData.append("urls", JSON.stringify(selectedUrls[i])); // Stringify the URL objects
    }

    // Append category objects as JSON strings
    for (let i = 0; i < selectedCategories.length; i++) {
      newFormData.append("categories", JSON.stringify(selectedCategories[i])); // Stringify the category objects
    }

    // Append tag objects as JSON strings
    for (let i = 0; i < selectedTags.length; i++) {
      newFormData.append("tags", JSON.stringify(selectedTags[i])); // Stringify the tag objects
    }

    // Append other fields
    newFormData.append("plot", formData.plot);
    newFormData.append("description", formData.description);
    newFormData.append("content", formData.content);
    newFormData.append("start_date", formData.start_date);
    newFormData.append("end_date", formData.end_date);
    newFormData.append("client", formData.client);
    newFormData.append("budget", formData.budget);
    newFormData.append("director", formData.director);
    newFormData.append("country", formData.country);
    newFormData.append("state", formData.state);
    newFormData.append("city", formData.city);
    newFormData.append("address", formData.address);
    newFormData.append("location_id", formData.location_id);
    newFormData.append("show", formData.show);
    newFormData.append("estate", formData.estate);
    newFormData.append("deletePrevMedia", formData.deletePrevMedia);
    newFormData.append("room_count", formData.room_count);
    newFormData.append("status", formData.status);

    try {
      if (update) {
        apiRequest
          .put(`/projects/${currentProjectId}`, newFormData)
          .then((res) => {
            refresh();
            handleCloseModal();
            fetchProjects();
          });
      } else {
        apiRequest.post(`/projects`, newFormData).then(() => {
          refresh();
          handleCloseModal();
          fetchProjects();
        });
      }
      // Refresh project list
    } catch (error) {
      refresh();
      toast.error("Failed to save project");
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await apiRequest.delete(`/projects/${id}`);
      fetchProjects(); // Refresh project list
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  if (loading.category || loading.project || loading.tag || loading.url) {
    <Loader />;
  }

  return (
    <div>
      <Helmet>
        <title>Homadil | Admin | Project</title>
      </Helmet>

      <Button
        className="m-2"
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal(null)}
      >
        Add <PlaylistAddIcon className="mx-2" />
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>plot</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.plot}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => handleOpenModal(project)}
                    startIcon={<FontAwesomeIcon icon={faEdit} />}
                  >
                    Update
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDeleteProject(project.id)}
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

      <Modal open={openModal} onClose={handleCloseModal}>
        <ProjectForm
          update={update}
          formData={formData}
          handleFormChange={handleFormChange}
          setFormData={setFormData}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          categories={categories}
          estates={estates}
          selectedUrls={selectedUrls}
          setSelectedUrls={setSelectedUrls}
          selectedTags={selectedTags}
          urls={urls}
          setSelectedTags={setSelectedTags}
          tags={tags}
          setFiles={setFiles}
          files={files}
          handleCloseModal={handleCloseModal}
          handleSaveProject={handleSaveProject}
          loader={loader}
        />
      </Modal>
    </div>
  );
};

export default Project;
