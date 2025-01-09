import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function MyComponent({ value, setValue }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // Heading levels
      [{ font: [] }], // Font options
      [{ size: [] }], // Font size options
      ["bold", "italic", "underline", "strike"], // Text styles
      ["blockquote", "code-block"], // Blockquote and code block
      [{ list: "ordered" }, { list: "bullet" }], // Ordered and bullet lists
      [{ indent: "-1" }, { indent: "+1" }], // Indentation
      ["link", "image", "video"], // Links, images, videos
      [{ align: [] }], // Text alignment options
      ["clean"], // Clear formatting
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
    "align",
  ];

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      modules={modules}
      formats={formats} // Ensures all formats are supported
    />
  );
}
