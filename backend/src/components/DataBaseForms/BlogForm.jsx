import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch,
  Chip,
  CircularProgress,
} from "@mui/material";
import QuillEditor from "../QuillEditor";
import apiRequest from "../../apiRequest";
import Loader from "../Loader";
import UploadFile from "../UploadFile";
import UploadFiles from "../UploadFiles";

export default function BlogForm({
  fetchBlogs,
  blog,
  update,
  handleCloseModal,
}) {
  const [formData, setFormData] = useState({
    title: update ? blog?.title : "",
    description: update ? blog?.description : "",
    content: update ? blog?.content : "",
    show: update ? blog?.show : "",
    media: update ? blog?.Media : [],
    quote: update ? blog?.quote : "",
    deletePrevMedia: false,
  });
  const [categories, setCategories] = useState([]);
  const [urls, setUrls] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    update ? blog.Categories.map((c) => c.id) : []
  );
  const [selectedUrls, setSelectedUrls] = useState(
    update ? blog.Urls.map((u) => u.id) : []
  );
  const [selectedTags, setSelectedTags] = useState(
    update ? blog.Tags.map((t) => t.id) : []
  );
  const [value, setValue] = useState(formData.content);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState({
    category: false,
    url: false,
    tag: false,
  });

  useEffect(() => {
    setLoading({ ...loading, category: true });
    setLoading({ ...loading, url: true });
    setLoading({ ...loading, tag: true });

    fetchCategories();
    fetchUrls();
    fetchTags();
  }, []);

  useEffect(() => {
    setFormData({ ...formData, content: value });
  }, [value, setValue]);

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

  function refresh() {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedUrls([]);
    setLoader(false);
  }

  function create(formData) {
    apiRequest
      .post("/blogs", formData)
      .then(() => {})
      .catch((error) => {
        console.error("Error creating blog:", error);
      })
      .finally(() => {
        refresh();
        handleCloseModal();
        fetchBlogs();
      });
  }

  function put(formData, id) {
    apiRequest
      .put(`/blogs/${id}`, formData)
      .then(() => {})
      .catch((error) => {
        console.error("Error creating blog:", error);
      })
      .finally(() => {
        refresh();
        handleCloseModal();
        fetchBlogs();
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    const newFormData = new FormData();

    // Append file objects
    for (let i = 0; i < formData.media.length; i++) {
      newFormData.append("files", formData.media[i]);
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
    newFormData.append("title", formData.title);
    newFormData.append("description", formData.description);
    newFormData.append("content", formData.content);
    newFormData.append("show", formData.show);
    newFormData.append("quote", formData.quote);
    newFormData.append("deletePrevMedia", formData.deletePrevMedia);

    if (update) {
      const media = blog.Media;
      const filteredMedia = formData.media.filter(
        (item) => item?.id != undefined
      );
      const mediaIds = media.map((item) => item.id);
      const filteredMediaIds = filteredMedia.map((item) => item.id);

      const missingIds = mediaIds.filter(
        (id) => !filteredMediaIds.includes(id)
      );
      newFormData.append("delete_media", missingIds);
    }

    if (update) {
      put(newFormData, blog.id);
    } else {
      create(newFormData);
    }
  };

  if (loading.category || loading.tag || loading.url) {
    return <Loader />;
  }

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <Box>
        <h3>{!update ? "Add New Blog" : "Update Blog"}</h3>
      </Box>
      <Box sx={{ p: 3 }}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          name="title"
          margin="normal"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          name="description"
          margin="normal"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <TextField
          label="Quote"
          variant="outlined"
          fullWidth
          name="quote"
          margin="normal"
          value={formData.quote}
          onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
        />

        <UploadFile
          formData={formData}
          setFormData={setFormData}
          style={styleSheet.addGap}
          update={update}
        />

        <FormControl fullWidth>
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            style={styleSheet.addGap}
            value={selectedCategories}
            onChange={(e) => setSelectedCategories(e.target.value)}
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={categories.find((cat) => cat.id === value)?.name}
                  />
                ))}
              </div>
            )}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>URLs</InputLabel>
          <Select
            multiple
            style={styleSheet.addGap}
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

        <FormControl fullWidth>
          <InputLabel>Tags</InputLabel>
          <Select
            multiple
            value={selectedTags}
            style={styleSheet.addGap}
            onChange={(e) => setSelectedTags(e.target.value)}
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={tags.find((tag) => tag.id === value)?.name}
                  />
                ))}
              </div>
            )}
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <QuillEditor value={value} setValue={setValue} />
        </Box>

        {update && (
          <FormControlLabel
            control={
              <Switch
                checked={formData.deletePrevMedia} // Control the checked state
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deletePrevMedia: e.target.checked,
                  })
                }
                color="primary" // Change color as needed
              />
            }
            label="Delete Previous Media" // Label for the switch
          />
        )}

        <UploadFiles
          formData={formData}
          setFormData={setFormData}
          style={styleSheet.addGap}
          update={update}
        />

        <Button
          variant="contained"
          color="primary"
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
      </Box>
    </form>
  );
}
const styleSheet = {
  addGap: { margin: "6px" },
};
