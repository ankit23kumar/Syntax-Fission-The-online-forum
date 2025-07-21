import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/userService";
import "../../styles/UserDashboard.css";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    profile_picture: null,
    email: "",
  });

  const [previewURL, setPreviewURL] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then((res) => {
        const { name, bio, profile_picture, email } = res.data;
        setForm({
          name: name || "",
          bio: bio || "",
          profile_picture: null, // don't load as File object
          email: email || "",
        });
        setPreviewURL(profile_picture); // just for image preview
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setErrorMsg("Failed to load profile");
      });
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, profile_picture: file }));
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("bio", form.bio);

    if (form.profile_picture instanceof File) {
      formData.append("profile_picture", form.profile_picture);
    }

    try {
      await updateProfile(formData);
      setSuccessMsg("✅ Profile updated successfully!");
      setErrorMsg("");
      setTimeout(() => navigate("/dashboard/profile"), 1200);
    } catch (err) {
      console.error("Profile update failed:", err);
      setSuccessMsg("");
      setErrorMsg("❌ Profile update failed. Please try again.");
    }
  };

  return (
    <div className="card p-4 shadow-sm border-0">
      <h4 className="fw-bold mb-3">Edit Your Profile</h4>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label for = "floatingInputDisabled">Email</label>
          <input
            id="floatingInputDisabled"
            className="form-control"
            name="email"
            value={form.email}
            readOnly
            disabled
          />
        </div>

        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Bio</label>
          <textarea
            className="form-control"
            name="bio"
            rows={4}
            value={form.bio}
            onChange={handleChange}
          />
        </div>
      
        <div className="mb-3">
          <label>Profile Picture</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {previewURL && (
            <div className="mt-2">
              <img
                src={previewURL}
                alt="Profile Preview"
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "10px" }}
              />
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-info text-white">
            Save
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => navigate("/dashboard/profile")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
