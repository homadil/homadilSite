import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import QuillEditor from "../QuillEditor";
export default function ProjectForm({
  update,
  formData,
  handleFormChange,
  setFormData,
  selectedCategories,
  setSelectedCategories,
  categories,
  selectedUrls,
  setSelectedUrls,
  selectedTags,
  urls,
  setSelectedTags,
  tags,
  setFiles,
  files,
  handleCloseModal,
  handleSaveProject,
  loader,
  estates,
}) {
  const styleSheet = {
    addGap: { margin: "6px" },
  };
  const handleDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: formData.exe === "image" ? "image/*" : "video/*",
    multiple: true,
  });
  const [value, setValue] = useState(formData.content);

  useEffect(() => {
    setFormData({ ...formData, content: value });
  }, [value]);

  return (
    <form
      onSubmit={handleSaveProject}
      encType="multipart/form-data"
      style={modalStyle}
    >
      <div className="d-flex justify-content-between p-4">
        <h2>{update ? "Update Project" : "Add Project"}</h2>
        <Button
          variant="contained"
          style={{ backgroundColor: "red", color: "white" }}
          onClick={handleCloseModal}
        >
          {" "}
          X
        </Button>
      </div>

      <TextField
        label="Plot"
        name="plot"
        value={formData.plot}
        onChange={handleFormChange}
        fullWidth
        style={styleSheet.addGap}
        required={update ? false : true}
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleFormChange}
        fullWidth
        style={styleSheet.addGap}
        required={update ? false : true}
      />

      <TextField
        label="Country"
        name="country"
        value={formData.country}
        onChange={handleFormChange}
        fullWidth
        style={styleSheet.addGap}
        required={update ? false : true}
      />
      <TextField
        label="State"
        name="state"
        value={formData.state}
        onChange={handleFormChange}
        fullWidth
        style={styleSheet.addGap}
        required={update ? false : true}
      />
      <TextField
        label="City"
        name="city"
        value={formData.city}
        onChange={handleFormChange}
        fullWidth
        style={styleSheet.addGap}
        required={update ? false : true}
      />
      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleFormChange}
        fullWidth
        style={styleSheet.addGap}
        required={update ? false : true}
      />

      <TextField
        label="Start Date"
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleFormChange}
        fullWidth
        required={update ? false : true}
        style={styleSheet.addGap}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="End Date"
        type="date"
        name="end_date"
        value={formData.end_date}
        onChange={handleFormChange}
        fullWidth
        required={update ? false : true}
        style={styleSheet.addGap}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Client"
        name="client"
        value={formData.client}
        style={styleSheet.addGap}
        onChange={handleFormChange}
        fullWidth
        required={update ? false : true}
      />
      <TextField
        label="Director"
        name="director"
        value={formData.director}
        onChange={handleFormChange}
        style={styleSheet.addGap}
        fullWidth
        required={update ? false : true}
      />
      <TextField
        label="Budget"
        type="number"
        name="budget"
        value={formData.budget}
        style={styleSheet.addGap}
        onChange={handleFormChange}
        fullWidth
        required={update ? false : true}
      />

      <TextField
        label="Room Count"
        type="number"
        name="room_count"
        value={formData.room_count}
        style={styleSheet.addGap}
        onChange={handleFormChange}
        fullWidth
        required={update ? false : true}
      />

      <Select
        labelId="select status"
        className="m-2"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
      >
        {[
          { label: "Carcass", value: "Carcass" },
          { label: "DPC", value: "DPC" },
          { label: "Non-DPC", value: "Non-DPC" },
          { label: "Only-Land", value: "Only-Land" },
        ].map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>

      <label className="d-flex justify-middle align-items-center">
        <Typography variant="body1" style={{ wordWrap: "normal" }}>
          Media
        </Typography>
        <input
          type="file"
          accept="image/*"
          style={styleSheet.addGap}
          className="form-control mt-3"
          required={update ? false : true}
          onChange={(e) => {
            setFormData({ ...formData, show: e.target.files[0] });
          }}
        />
      </label>

      <FormControl fullWidth>
        <InputLabel>Estate</InputLabel>
        <Select
          style={styleSheet.addGap}
          value={formData.estate}
          onChange={(e) =>
            setFormData({ ...formData, estate: e.target?.value })
          }
        >
          {estates.map((estate) => (
            <MenuItem key={estate.id} value={estate.id}>
              {estate.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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

      {/* File Drag and Drop */}
      <div
        {...getRootProps()}
        className={`dropzone border p-4 mt-3 text-center mb-3 ${
          isDragActive ? "bg-light" : ""
        }`}
        style={{ cursor: "pointer" }}
      >
        <input {...getInputProps()} required={update ? false : true} />
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

      <Button
        variant="contained"
        style={styleSheet.addGap}
        color="primary"
        sx={{ mt: 3 }}
        type="submit"
        disabled={loader.project} // Disable button when loading
      >
        {loader.project ? (
          <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> // Spinner when loading
        ) : !update ? (
          "Add"
        ) : (
          "Update"
        )}
      </Button>
    </form>
  );
}

// Modal style
const modalStyle = {
  position: "absolute",
  display: "flex",
  borderRadius: "8px",
  flexDirection: "column",
  top: "50%",
  left: "50%",
  overflowY: "auto",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  boxShadow: 24,
  padding: "16px",
  maxHeight: "80vh",
  maxWidth: "600px",
  width: "100%",
};
