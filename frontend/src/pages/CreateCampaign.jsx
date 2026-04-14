import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Target, AlignLeft, Tags, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateCampaign() {
  const [formData, setFormData] = useState({ title: "", description: "", targetAmount: "", category: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return (
      <div className="container" style={{ textAlign: "center", paddingTop: "100px" }}>
        <h2>Authentication Required</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "10px" }}>Please log in to start a campaign.</p>
        <button onClick={() => navigate("/login")} className="btn btn-primary" style={{ marginTop: "20px" }}>Log In</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData, createdBy: user.name || user.email };
      const res = await axios.post("http://localhost:5000/api/campaigns", payload);
      toast.success("Campaign created successfully!");
      navigate(`/campaign/${res.data._id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create campaign.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <div className="glass-panel animate-fade-in" style={{ padding: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>Create a <span className="text-gradient">Campaign</span></h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "40px", fontSize: "1.1rem" }}>
          Tell us about your cause and set a goal to make it happen. Every journey starts with a simple step.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Campaign Title</label>
            <div style={{ position: "relative" }}>
              <Target size={20} color="var(--text-secondary)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text" 
                required
                className="glass-input" 
                placeholder="Help Build a School in Kenya" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                style={{ paddingLeft: "48px" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label>Target Amount ($)</label>
              <div style={{ position: "relative" }}>
                <DollarSign size={20} color="var(--text-secondary)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
                <input 
                  type="number" 
                  min="1"
                  required
                  className="glass-input" 
                  placeholder="5000" 
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                  style={{ paddingLeft: "48px" }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <div style={{ position: "relative" }}>
                <Tags size={20} color="var(--text-secondary)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
                <select 
                  className="glass-input"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  style={{ paddingLeft: "48px", appearance: "none" }}
                >
                  <option value="" disabled>Select a category</option>
                  <option value="Education">Education</option>
                  <option value="Medical">Medical</option>
                  <option value="Environment">Environment</option>
                  <option value="Technology">Technology</option>
                  <option value="Community">Community</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Campaign Description</label>
            <div style={{ position: "relative" }}>
              <AlignLeft size={20} color="var(--text-secondary)" style={{ position: "absolute", left: "16px", top: "20px" }} />
              <textarea 
                required
                rows="6"
                className="glass-input" 
                placeholder="Describe your cause, why it matters, and how the funds will be used..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ paddingLeft: "48px", paddingTop: "18px", resize: "vertical" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "30px" }}>
             <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginRight: "16px" }}>Cancel</button>
             <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? "Publishing..." : "Publish Campaign"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
