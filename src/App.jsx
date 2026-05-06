import { useState } from "react";
import SubmitForm from "./SubmitForm";
import Gallery from "./Gallery";
import "./styles.css";

export default function App() {
  const [view, setView] = useState("form"); // "form" | "gallery"
  const [refresh, setRefresh] = useState(0);

  const handleSuccess = () => {
    setRefresh((r) => r + 1);
    setView("gallery");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">◆</span>
            <span className="logo-text">DataVault</span>
          </div>
          <nav className="nav">
            <button
              className={`nav-btn ${view === "form" ? "active" : ""}`}
              onClick={() => setView("form")}
            >
              Submit Entry
            </button>
            <button
              className={`nav-btn ${view === "gallery" ? "active" : ""}`}
              onClick={() => setView("gallery")}
            >
              View Records
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {view === "form" ? (
          <SubmitForm onSuccess={handleSuccess} />
        ) : (
          <Gallery key={refresh} />
        )}
      </main>

      <footer className="footer">
        <span>DataVault © 2026 — MySQL + React + Node.js</span>
      </footer>
    </div>
  );
}
