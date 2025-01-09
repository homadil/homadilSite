import React, { useEffect, useState } from "react";
import {
  MenuItem,
  Button,
  InputLabel,
  Select,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import apiRequest from "../../apiRequest";
import Loader from "../Loader";
import { toast } from "react-toastify";

const MediaForm = ({
  usageToggle = true,
  type,
  media,
  handlePushCreate,
  handlePutCreate,
  handleCloseModal,
}) => {
  const [formData, setFormData] = useState({
    parent_id: media?.parent_id || null,
    type: media?.type || type,
    exe: media?.exe || "", // File type: image or video
  });

  const [files, setFiles] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await apiRequest.get("/blogs");
        setBlogs(res);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await apiRequest.get("/projects");
        setProjects(res);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchBlogs();
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: formData.exe === "image" ? "image/*" : "video/*",
    multiple: true,
  });

  function create(datas) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // Append actual file objects
    }
    formData.append("parent_id", datas.parent_id);
    formData.append("type", datas.type);
    formData.append("exe", datas.exe);

    apiRequest
      .post(
        `/medias`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        handlePushCreate(res.media);
        setLoader(false);
        handleCloseModal();
      });
  }

  function update(datas) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]); // Append actual file objects
    }
    formData.append("parent_id", datas.parent_id);
    formData.append("type", datas.type);
    formData.append("exe", datas.exe);

    apiRequest
      .put(
        `/medias/${media.id}`,
        formData,
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        handlePutCreate(res.media);
        setLoader(false);
        handleCloseModal();
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here (e.g., upload files, send formData to API)
    setLoader(true);
    const datas = { ...formData, files };
    datas.type = datas.type.toLowerCase();
    if (datas.type == "project" || datas.type == "blog") {
      if (datas.parent_id == "" || datas.parent_id == null) {
        setLoader(false);
        return toast.error("Select Option First");
      }
    }
    if (usageToggle) {
      create(datas);
    } else {
      update(datas);
    }
  };

  // Check if both data sets are loading
  if (loadingBlogs || loadingProjects) {
    return <Loader />; // You can customize this loading state
  }

  return (
    <div className="container mt-4">
      <h3>{usageToggle ? " Add New Media" : "Update Media"}</h3>
      <form
        onSubmit={handleSubmit}
        className="p-3 border rounded"
        encType="multipart/form-data"
      >
        {/* Type Selection */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            label="Type"
            required
          >
            <MenuItem value="project">Project</MenuItem>
            <MenuItem value="blog">Blog</MenuItem>
            <MenuItem value="home_header">Home Header</MenuItem>
            <MenuItem value="home_grid">Home Grid</MenuItem>
            <MenuItem value="news_header">News Header</MenuItem>
            <MenuItem value="project_header">Project Header</MenuItem>
            <MenuItem value="about_us_header">About Us Header</MenuItem>
            <MenuItem value="about_us_image">About Us Image</MenuItem>
            <MenuItem value="contact_us_header">Contact Us Header</MenuItem>
          </Select>
        </FormControl>

        {(formData.type === "blog" || formData.type === "project") && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>
              {formData.type === "blog" ? "Select Blog" : "Select Project"}
            </InputLabel>
            <Select
              value={formData.parent_id}
              onChange={(e) =>
                setFormData({ ...formData, parent_id: e.target.value })
              }
            >
              {(formData.type === "Blog" ? blogs : projects).map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Media Type Selection (Image or Video) */}
        <FormControl fullWidth margin="normal">
          <InputLabel>File Type</InputLabel>
          <Select
            name="exe"
            value={formData.exe}
            onChange={handleChange}
            label="File Type"
            required
          >
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="video">Video</MenuItem>
          </Select>
        </FormControl>

        {/* File Drag and Drop */}
        <div
          {...getRootProps()}
          className={`dropzone border p-4 text-center mb-3 ${
            isDragActive ? "bg-light" : ""
          }`}
          style={{ cursor: "pointer" }}
        >
          <input {...getInputProps()} />
          <p>
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop files here, or click to select files"}
          </p>
          {formData.exe === "image" ? (
            <p>Only images are allowed</p>
          ) : (
            <p>Only videos are allowed</p>
          )}
        </div>

        {/* Display Selected Files */}
        {files.length > 0 && (
          <div>
            <h5>Selected Files:</h5>
            <ul className="list-group">
              {files.map((file, idx) => (
                <li key={idx} className="list-group-item">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          className="mt-3"
          disabled={loader} // Disable button when loading
        >
          {loader ? (
            <CircularProgress size={24} color="inherit" /> // Spinner when loading
          ) : usageToggle ? (
            "Submit"
          ) : (
            "Update"
          )}
          Media
        </Button>
      </form>
    </div>
  );
};

export default MediaForm;
