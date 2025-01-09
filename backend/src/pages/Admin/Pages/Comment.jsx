import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Assuming you use axios to make API requests
import { toast } from "react-toastify"; // For notifications
import apiRequest from "../../../apiRequest";
import Loader from "../../../components/Loader";
import { Helmet } from "react-helmet-async";
const CommentTable = () => {
  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  // Fetch comments from the backend
  useEffect(() => {
    setLoading(true);
    apiRequest
      .get("/comments")
      .then((res) => {
        setComments(res);
      })
      .finally(() => {
        setLoading(false);
      }); // Replace with your actual endpoint
  }, []);

  // Delete comment by id
  const handleDelete = async (id) => {
    apiRequest.delete(`/comments/${id}`).then((res) => {
      setComments(comments.filter((comment) => comment.id !== id));
      toast.success(res?.msg);
    });
  };

  // Filter comments based on search term (username or content)
  const filteredComments = comments.filter((comment) => {
    return (
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    <Loader />;
  }

  return (
    <div>
      <Helmet>
        <title>Homadil | Admin | Comment</title>
      </Helmet>

      <TextField
        label="Search by User Name or Content"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    {comment.user ? comment.user.name : "Guest User"}
                  </TableCell>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>{comment.type}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<FontAwesomeIcon icon={faTrash} />}
                      onClick={() => handleDelete(comment.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No comments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CommentTable;
