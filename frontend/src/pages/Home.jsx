import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { TrendingUp, Search, Filter } from "lucide-react";

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    axios.get("http://localhost:5000/api/campaigns")
      .then(res => {
        setCampaigns(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ textAlign: "center", padding: "80px 20px", marginBottom: "40px" }}>
        <h1 className="animate-fade-in" style={{ fontSize: "4rem", marginBottom: "20px" }}>
          Empower the Future with <br />
          <span className="text-gradient">Meaningful Action</span>
        </h1>
        <p className="animate-fade-in delay-100" style={{ fontSize: "1.2rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 40px" }}>
          Join thousands of trailblazers making a difference. Launch your campaign or support a cause that matters to you today.
        </p>
        <div className="animate-fade-in delay-200" style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <Link to="/create" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "1.1rem" }}>
            Start a Campaign
          </Link>
          <a href="#explore" className="btn btn-secondary" style={{ padding: "14px 32px", fontSize: "1.1rem" }}>
            Explore Causes
          </a>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section id="explore" className="container">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "2rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <TrendingUp color="var(--accent-green)" /> Trending Campaigns
          </h2>
          
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <Search size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text" 
                className="glass-input" 
                placeholder="Search campaigns..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: "38px", width: "250px", padding: "10px 10px 10px 38px" }}
              />
            </div>
            
            <div style={{ position: "relative" }}>
              <Filter size={18} color="var(--text-secondary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <select 
                className="glass-input"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ paddingLeft: "38px", width: "160px", appearance: "none", padding: "10px 10px 10px 38px" }}
              >
                <option value="All">All Categories</option>
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

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--text-secondary)" }}>
            <div style={{ width: "40px", height: "40px", border: "4px solid var(--glass-border)", borderTopColor: "var(--accent-pink)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }}></div>
            Loading campaigns...
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
            {campaigns
              .filter(camp => {
                const matchesSearch = camp.title.toLowerCase().includes(searchQuery.toLowerCase()) || camp.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === "All" || camp.category === selectedCategory;
                return matchesSearch && matchesCategory;
              })
              .map((camp, i) => {
              const progress = Math.min((camp.raisedAmount / camp.targetAmount) * 100, 100) || 0;
              
              return (
                <div key={camp._id} className="glass-panel animate-fade-in" style={{ animationDelay: `${(i % 3 + 1) * 100}ms`, padding: "24px", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <span style={{ background: "rgba(157, 78, 221, 0.2)", color: "var(--accent-purple)", padding: "4px 10px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600 }}>
                      {camp.category || "General"}
                    </span>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                      {new Date(camp.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: "1.4rem", marginBottom: "10px" }}>{camp.title}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "24px", flexGrow: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {camp.description}
                  </p>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", marginBottom: "8px" }}>
                      <span style={{ fontWeight: 600, color: "var(--accent-cyan)" }}>${camp.raisedAmount}</span>
                      <span style={{ color: "var(--text-secondary)" }}>of ${camp.targetAmount}</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <Link to={`/campaign/${camp._id}`} className="btn btn-secondary" style={{ width: "100%" }}>
                    View Campaign
                  </Link>
                </div>
              );
            })}
            
            {campaigns.filter(camp => {
                const matchesSearch = camp.title.toLowerCase().includes(searchQuery.toLowerCase()) || camp.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === "All" || camp.category === selectedCategory;
                return matchesSearch && matchesCategory;
              }).length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", background: "var(--glass-bg)", borderRadius: "20px", border: "1px dashed var(--glass-border)", color: "var(--text-secondary)" }}>
                 No campaigns found matching your search.
              </div>
            )}
          </div>
        )}
      </section>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
