import React, { useEffect, useState } from "react";
import axiosInstance from "../services/api";
import { FaTrash } from "react-icons/fa";
import "../styles/AdminUsers.css"; // reuse existing admin styles

const AdminTags = () => {
  const [tags, setTags] = useState([]);
  const [tagName, setTagName] = useState("");
  const [editTagId, setEditTagId] = useState(null);
  const [editTagName, setEditTagName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTags = async () => {
    try {
      const res = await axiosInstance.get("/admin/tags/");
      setTags(res.data);
    } catch (err) {
      console.error("Failed to fetch tags", err);
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
    } catch (err) {
      console.error("Add tag failed", err.response?.data || err.message);
      alert("Failed to add tag.");
    }
  };

  const deleteTag = async (tag_id) => {
    if (!window.confirm("Delete this tag?")) return;
    try {
      await axiosInstance.delete(`/admin/tags/${tag_id}/`);
      setTags((prev) => prev.filter((tag) => tag.tag_id !== tag_id));
    } catch (err) {
      console.error("Delete failed", err.response?.data || err.message);
      alert("Failed to delete tag.");
    }
  };

  const updateTag = async (tag_id) => {
    if (!editTagName.trim()) return;
    try {
      const res = await axiosInstance.put(`/admin/tags/${tag_id}/`, {
        tag_name: editTagName,
      });
      setTags((prev) =>
        prev.map((tag) => (tag.tag_id === tag_id ? res.data : tag))
      );
      setEditTagId(null);
      setEditTagName("");
    } catch (err) {
      console.error("Update failed", err.response?.data || err.message);
      alert("Failed to update tag.");
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="admin-page">
      <h2>Manage Tags</h2>

      <form onSubmit={addTag} className="d-flex mb-3 gap-2">
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          className="form-control"
          placeholder="New tag name"
        />
        <button className="btn btn-primary">Add Tag</button>
      </form>

      {loading ? (
        <p>Loading tags...</p>
      ) : tags.length === 0 ? (
        <p>No tags found.</p>
      ) : (
        <ul className="list-group">
          {tags.map((tag) => (
            <li
              key={tag.tag_id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {editTagId === tag.tag_id ? (
                <div className="w-100 d-flex align-items-center gap-2">
                  <input
                    type="text"
                    className="form-control"
                    value={editTagName}
                    onChange={(e) => setEditTagName(e.target.value)}
                  />
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => updateTag(tag.tag_id)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setEditTagId(null);
                      setEditTagName("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>{tag.tag_name}</span>
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        setEditTagId(tag.tag_id);
                        setEditTagName(tag.tag_name);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTag(tag.tag_id)}
                      className="btn btn-sm btn-danger"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminTags;
