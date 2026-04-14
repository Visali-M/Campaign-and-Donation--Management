import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Rocket, User, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      width: "100%",
      zIndex: 100,
      padding: "16px 0",
      background: "rgba(15, 10, 30, 0.6)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--glass-border)"
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <Rocket color="var(--accent-pink)" size={28} />
          <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "white" }}>
            Neon<span className="text-gradient">Fund</span>
          </span>
        </Link>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {user ? (
            <>
              <Link to="/create" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>
                Start Campaign
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "16px", paddingLeft: "16px", borderLeft: "1px solid var(--glass-border)" }}>
                <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                  <User size={18} color="var(--accent-cyan)" />
                  {user.name}
                </span>
                <button onClick={handleLogout} className="btn" style={{ padding: "8px", background: "transparent", border: "1px solid var(--glass-border)", color: "white" }}>
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline" style={{ padding: "8px 24px", fontSize: "0.9rem" }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
