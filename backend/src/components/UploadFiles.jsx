import React, { useState, useEffect } from "react";
import { Typography, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { toast } from "react-toastify";

const url = process.env.REACT_APP_BACKEND_URL + "/";

export default function UploadFiles({ style, update, setFormData, formData }) {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (Array.isArray(formData?.media)) {
      setPreviews(
        formData.media.map((file) => {
          return file instanceof File
            ? URL.createObjectURL(file)
            : url + file.path;
        })
      );
    }
  }, [formData]);

  const handleFileChange = (files) => {
    const existingFiles = formData?.media || [];

    const newFiles = Array.from(files).filter((file) => {
      if (existingFiles.some((existing) => existing.name === file.name)) {
        toast.error(`${file.name} is already selected.`);
        return false;
      }

      if (file.type.startsWith("video") && file.size > 30 * 1024 * 1024) {
        toast.error("Video size should be less than 30MB");
        return false;
      }

      return true;
    });

    if (newFiles.length === 0) return;

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setPreviews([...previews, ...newPreviews]);
    setFormData({
      ...formData,
      media: [...existingFiles, ...newFiles],
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newFiles = (formData?.media || []).filter((_, i) => i !== index);

    setPreviews(newPreviews);
    setFormData({ ...formData, media: newFiles });
  };

  return (
    <div className="upload-container mt-3" style={{ ...style }}>
      {/* Upload Area */}
      <div
        style={{
          textAlign: "center",
          border: "2px dashed #ccc",
          padding: "20px",
          borderRadius: "10px",
          cursor: "pointer",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <label className="d-flex flex-column align-items-center">
          <Typography variant="body1" style={{ wordWrap: "normal" }}>
            Upload Media (Images/Videos)
          </Typography>
          <input
            type="file"
            accept="image/*, video/*"
            multiple
            style={{ display: "none" }}
            required={!update}
            onChange={(e) => handleFileChange(e.target.files)}
          />
          <p style={{ marginTop: "10px", color: "#999" }}>
            Drag & drop or click to upload
          </p>
        </label>
      </div>

      {/* Preview Section */}
      {previews.length > 0 && (
        <div
          className="preview-container mt-3"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {previews.map((item, index) => (
            <div key={index} style={{ position: "relative", width: "150px" }}>
              {formData.media[index] instanceof File &&
              formData.media[index].type.startsWith("video") ? (
                <video
                  src={item}
                  controls
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    maxHeight: "150px",
                  }}
                />
              ) : (
                <img
                  src={item.src || item}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "150px",
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
              )}
              <IconButton
                onClick={() => removeFile(index)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.5)",
                }}
              >
                <Delete style={{ color: "#fff" }} />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
