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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import QuillEditor from "../QuillEditor";
import UploadFile from "../UploadFile";
import UploadFiles from "../UploadFiles";
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
  handleCloseModal,
  handleSaveProject,
  loader,
  estates,
}) {
  const styleSheet = {
    addGap: { margin: "6px" },
  };

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
        label="Location"
        name="point"
        value={formData.point}
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
      />
      <TextField
        label="Client"
        name="client"
        value={formData.client}
        style={styleSheet.addGap}
        onChange={handleFormChange}
        fullWidth
        required={update ? false : false}
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

      <UploadFile
        formData={formData}
        setFormData={setFormData}
        style={styleSheet.addGap}
        update={update}
      />

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

      <UploadFiles
        formData={formData}
        setFormData={setFormData}
        style={styleSheet.addGap}
        update={update}
      />

      <Button
        variant="contained"
        style={styleSheet.addGap}
        color="primary"
        sx={{ mt: 3 }}
        type="submit"
        disabled={loader} // Disable button when loading
      >
        {loader ? (
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
