// src/pages/AdminTags.jsx

import React, { useEffect, useState } from "react";
import axiosInstance from "../services/api";
import { FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../contexts/ToastContext";
import "../styles/AdminTags.css"; // <-- Import the new dedicated CSS

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [tagName, setTagName] = useState("");
  const [editTagId, setEditTagId] = useState(null);
  const [editTagName, setEditTagName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const { showToast } = useToast();

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/tags/");
      setTags(res.data);
    } catch (err) {
      showToast("Failed to fetch tags.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const addTag = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    try {
      const res = await axiosInstance.post("/admin/tags/", { tag_name: tagName });
      setTags((prev) => [...prev, res.data]);
      setTagName("");
      showToast(`Tag "${tagName}" added successfully.`, "success");
    } catch (err) {
      showToast(err.response?.data?.tag_name?.[0] || "Failed to add tag.", "danger");
    }
  };

  const promptDelete = (tag) => {
    setTagToDelete(tag);
    setShowConfirmModal(true);
  };

  const deleteTag = async () => {
    if (!tagToDelete) return;
    try {
      await axiosInstance.delete(`/admin/tags/${tagToDelete.tag_id}/`);
      setTags((prev) => prev.filter((tag) => tag.tag_id !== tagToDelete.tag_id));
      showToast(`Tag "${tagToDelete.tag_name}" deleted.`, "success");
    } catch (err) {
      showToast("Failed to delete tag.", "danger");
    } finally {
      setShowConfirmModal(false);
      setTagToDelete(null);
    }
  };

  const updateTag = async (tag_id) => {
    if (!editTagName.trim()) return;
    try {
      const res = await axiosInstance.put(`/admin/tags/${tag_id}/`, { tag_name: editTagName });
      setTags((prev) => prev.map((tag) => (tag.tag_id === tag_id ? res.data : tag)));
      showToast("Tag updated successfully.", "success");
    } catch (err) {
      showToast("Failed to update tag.", "danger");
    } finally {
      setEditTagId(null);
      setEditTagName("");
    }
  };
  
  const startEditing = (tag) => {
    setEditTagId(tag.tag_id);
    setEditTagName(tag.tag_name);
  };
  
  const cancelEditing = () => {
    setEditTagId(null);
    setEditTagName("");
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="admin-page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="admin-header">
          <div>
            <h2 className="page-title">Manage Tags</h2>
            <p className="page-subtitle">Add, edit, or remove tags to organize content.</p>
          </div>
        </div>
      </motion.div>

      <motion.form 
        onSubmit={addTag} 
        className="add-tag-form"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="New tag name"
        />
        <button type="submit">Add Tag</button>
      </motion.form>

      <motion.div 
        className="tag-list-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="p-4 text-center">Loading tags...</div>
        ) : tags.length === 0 ? (
          <div className="p-4 text-center">No tags found.</div>
        ) : (
          <ul className="list-unstyled mb-0">
            {tags.map((tag) => (
              <li key={tag.tag_id} className="tag-item">
                {editTagId === tag.tag_id ? (
                  <div className="edit-tag-form">
                    <input
                      type="text"
                      value={editTagName}
                      onChange={(e) => setEditTagName(e.target.value)}
                      autoFocus
                    />
                    <button className="btn btn-save" onClick={() => updateTag(tag.tag_id)}>Save</button>
                    <button className="btn btn-cancel" onClick={cancelEditing}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <span>{tag.tag_name}</span>
                    <div className="tag-actions">
                      <button className="btn btn-edit" onClick={() => startEditing(tag)}>Edit</button>
                      <button onClick={() => promptDelete(tag)} className="btn btn-delete">
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* --- Confirmation Modal --- */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div className="modal-backdrop-dark" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content-dark confirm-modal" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}>
              <div className="modal-body-dark text-center">
                <div className="confirm-icon"><FaTrash /></div>
                <h5>Delete Tag</h5>
                <p>Are you sure you want to delete the tag "{tagToDelete?.tag_name}"? This action cannot be undone.</p>
              </div>
              <div className="modal-footer-dark confirm-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={deleteTag}>Yes, Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTags;