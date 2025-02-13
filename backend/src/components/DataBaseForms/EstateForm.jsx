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
  TextareaAutosize,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import QuillEditor from "../QuillEditor";
import UploadFile from "../UploadFile";
import UploadFiles from "../UploadFiles";

export default function EstateForm({
  update,
  formData,
  handleFormChange,
  setFormData,
  selectedCategories,
  setSelectedCategories,
  categories,
  handleCloseModal,
  handleSaveEstate,
  loader,
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
      onSubmit={handleSaveEstate}
      encType="multipart/form-data"
      style={modalStyle}
    >
      <div className="d-flex justify-content-between p-4">
        <h2>{update ? "Update Estate" : "Add Estate"}</h2>
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
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleFormChange}
        fullWidth
        style={styleSheet.addGap}
        required={update ? false : true}
      />
      <TextField
        label=" Estate Code"
        name="code"
        value={formData.code}
        onChange={handleFormChange}
        style={styleSheet.addGap}
        fullWidth
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
        label="Estimate"
        type="number"
        name="estimate"
        value={formData.estimate}
        onChange={handleFormChange}
        fullWidth
        required={update ? false : true}
        style={styleSheet.addGap}
      />
      <TextField
        label="Area"
        type="text"
        name="area"
        value={formData.area}
        onChange={handleFormChange}
        fullWidth
        required={update ? false : true}
        style={styleSheet.addGap}
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
        label="Price Range"
        type="text"
        name="price_range"
        value={formData.price_range}
        style={styleSheet.addGap}
        onChange={handleFormChange}
        fullWidth
        required={update ? false : true}
      />
      <TextField
        label="Amount Of Projects"
        type="number"
        name="number_of_units"
        value={formData.number_of_units}
        style={styleSheet.addGap}
        onChange={handleFormChange}
        fullWidth
        required={update ? false : true}
      />

      <TextareaAutosize
        placeholder="Amenities (Separate list By Comma)"
        name="amenities"
        value={formData.amenities}
        style={{ minHeight: "100px", padding: "5px", margin: "5px" }}
        onChange={handleFormChange}
        minRows={5}
        required={update ? false : true}
      />
      <textarea
        name="nearbyLocations"
        id="nearbyLocations"
        style={{ minHeight: "100px", padding: "5px", margin: "5px" }}
        value={formData.nearbyLocations}
        onChange={handleFormChange}
        required={update ? false : true}
        placeholder="Near By Locations (Separate list By Comma)"
        cols="30"
        rows="10"
      ></textarea>

      <UploadFile
        formData={formData}
        setFormData={setFormData}
        style={styleSheet.addGap}
        update={update}
      />

      <FormControl>
        <InputLabel id="select-label">Select Option</InputLabel>
        <Select
          labelId="select status"
          className="m-2"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          {[
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Completed", value: "completed" },
          ].map((item, index) => (
            <MenuItem key={index} value={item.value}>
              {item.label}
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
        disabled={loader.estate} // Disable button when loading
      >
        {loader.estate ? (
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
  flexDirection: "column",
  top: "50%",
  left: "50%",
  borderRadius: "8px",
  overflowY: "auto",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  boxShadow: 24,
  padding: "16px",
  maxHeight: "80vh",
  maxWidth: "600px",
  width: "100%",
};
