import { useState, useEffect } from "react";

const API = "http://localhost:5000/api";
const IMG_BASE = "http://localhost:5000";

const CATEGORY_COLORS = {
  Technology: "#3b82f6",
  Design: "#ec4899",
  Marketing: "#f59e0b",
  Finance: "#10b981",
  Operations: "#8b5cf6",
  Other: "#6b7280",
};

export default function Gallery() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Technology", "Design", "Marketing", "Finance", "Operations", "Other"];

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/entries`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setEntries(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API}/entries/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setEntries(e => e.filter(x => x.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = filter === "All" ? entries : entries.filter(e => e.category === filter);

  if (loading) return (
    <div className="page-container center">
      <div className="big-spinner" />
      <p className="loading-text">Fetching records…</p>
    </div>
  );

  if (error) return (
    <div className="page-container center">
      <div className="error-box">
        <p>⚠️ {error}</p>
        <button className="retry-btn" onClick={fetchEntries}>Retry</button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="gallery-header">
        <div>
          <h1 className="card-title">Records</h1>
          <p className="card-sub">{entries.length} total entries in the database</p>
        </div>
        <button className="refresh-btn" onClick={fetchEntries}>↻ Refresh</button>
      </div>

      {/* Filter pills */}
      <div className="filter-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-pill ${filter === cat ? "active" : ""}`}
            onClick={() => setFilter(cat)}
            style={filter === cat && cat !== "All"
              ? { background: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat] }
              : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📭</p>
          <p className="empty-text">No entries found</p>
          <p className="empty-sub">Submit a new entry to see it here</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map(entry => (
            <div className="record-card" key={entry.id}>
              {entry.image_url ? (
                <div className="record-img-wrap">
                  <img
                    src={`${IMG_BASE}${entry.image_url}`}
                    alt={entry.image_name}
                    className="record-img"
                    onError={e => { e.target.style.display = "none"; }}
                  />
                </div>
              ) : (
                <div className="record-img-placeholder">
                  <span>🖼</span>
                </div>
              )}

              <div className="record-body">
                <div className="record-top">
                  <span
                    className="record-category"
                    style={{ background: CATEGORY_COLORS[entry.category] + "22",
                             color: CATEGORY_COLORS[entry.category] }}
                  >
                    {entry.category}
                  </span>
                  <span className="record-id">#{entry.id}</span>
                </div>

                <h3 className="record-name">{entry.name}</h3>
                <p className="record-email">{entry.email}</p>

                {entry.description && (
                  <p className="record-desc">{entry.description}</p>
                )}

                <div className="record-footer">
                  <span className="record-date">
                    {new Date(entry.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric"
                    })}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(entry.id)}
                    disabled={deleting === entry.id}
                  >
                    {deleting === entry.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
