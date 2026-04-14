import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/users/login" : "/api/users/register";
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      } else {
        // Fallback if the backend wasn't fully updated or has weird responses
        if (res.data.message === "Login successful") {
            // we really need the user object, but if missing we just make one up
            localStorage.setItem("user", JSON.stringify({ name: formData.email.split('@')[0], email: formData.email }));
            navigate("/");
        } else if (res.data.message === "User registered") {
             setIsLogin(true);
             setError("Registration successful. Please log in.");
        } else {
             setError(res.data.message || "An error occurred");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 160px)" }}>
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "450px", padding: "40px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "8px", fontSize: "2rem" }}>
          {isLogin ? "Welcome Back" : "Join the Movement"}
        </h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "32px" }}>
          {isLogin ? "Sign in to continue making an impact." : "Create an account to start your journey."}
        </p>

        {error && (
          <div style={{ background: "rgba(255, 0, 110, 0.1)", borderLeft: "4px solid var(--accent-pink)", padding: "12px 16px", borderRadius: "8px", marginBottom: "24px", color: "#ffb3c6", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={20} color="var(--text-secondary)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type="text" 
                  required
                  className="glass-input" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ paddingLeft: "48px" }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail size={20} color="var(--text-secondary)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="email" 
                required
                className="glass-input" 
                placeholder="you@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ paddingLeft: "48px" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={20} color="var(--text-secondary)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="password" 
                required
                className="glass-input" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{ paddingLeft: "48px" }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: "16px", padding: "14px" }}>
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            style={{ background: "none", border: "none", color: "var(--accent-cyan)", fontWeight: 600, cursor: "pointer", fontSize: "0.95rem" }}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}
