import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
const url = process.env.REACT_APP_BACKEND_URL + "/";
export default function UploadFile({ style, update, setFormData, formData }) {
  const [preview, setPreview] = useState(url + formData?.show || null);

  useEffect(() => {
    if (formData?.show && typeof formData.show === "string") {
      setPreview(url + formData.show);
    }
  }, [formData]);

  const handleFileChange = (file) => {
    if (file) {
      setPreview(URL.createObjectURL(file)); // Generate a preview URL
      setFormData({ ...formData, show: file });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  return (
    <div
      className="upload-container mt-3"
      style={{
        textAlign: "center",
        border: "2px dashed #ccc",
        padding: "20px",
        borderRadius: "10px",
        cursor: "pointer",
        ...style,
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <label className="d-flex flex-column align-items-center">
        <Typography variant="body1" style={{ wordWrap: "normal" }}>
          Upload Display Media
        </Typography>

        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              marginTop: "10px",
            }}
          />
        ) : (
          <p style={{ marginTop: "10px", color: "#999" }}>
            Drag & drop or click to upload
          </p>
        )}

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          required={!update}
          onChange={(e) => handleFileChange(e.target.files[0])}
        />
      </label>
    </div>
  );
}
