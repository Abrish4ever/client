import { useState, useRef } from "react";

const API = "http://localhost:5000/api";

const CATEGORIES = ["Technology", "Design", "Marketing", "Finance", "Operations", "Other"];

export default function SubmitForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "", email: "", category: "", description: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState(null); // { type: "success"|"error", msg }
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append("image", image);

      const res = await fetch(`${API}/entries`, { method: "POST", body: data });
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || "Server error");

      setStatus({ type: "success", msg: "Entry saved successfully! 🎉" });
      setForm({ name: "", email: "", category: "", description: "" });
      clearImage();
      setTimeout(onSuccess, 1200);
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <div className="card-header">
          <h1 className="card-title">New Entry</h1>
          <p className="card-sub">Fill in the details and optionally attach an image</p>
        </div>

        {status && (
          <div className={`alert alert-${status.type}`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="entry-form">
          <div className="form-row">
            <div className="field">
              <label className="label">Full Name *</label>
              <input
                className="input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
              />
            </div>
            <div className="field">
              <label className="label">Email *</label>
              <input
                className="input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Category *</label>
            <select
              className="input select"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">— Select a category —</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <textarea
              className="input textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add any relevant notes or context…"
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div className="field">
            <label className="label">Image (optional · max 5 MB)</label>
            {!preview ? (
              <div
                className="drop-zone"
                onClick={() => fileRef.current.click()}
              >
                <div className="drop-icon">🖼</div>
                <p className="drop-text">Click to upload an image</p>
                <p className="drop-hint">JPG, PNG, GIF, WEBP</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  hidden
                />
              </div>
            ) : (
              <div className="preview-box">
                <img src={preview} alt="Preview" className="preview-img" />
                <div className="preview-info">
                  <span className="preview-name">{image?.name}</span>
                  <span className="preview-size">
                    {(image?.size / 1024).toFixed(1)} KB
                  </span>
                  <button type="button" className="remove-btn" onClick={clearImage}>
                    ✕ Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="btn-loading"><span className="spinner" /> Saving…</span>
            ) : "Save to Database →"}
          </button>
        </form>
      </div>
    </div>
  );
}
