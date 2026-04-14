import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Copy, HeartHandshake, User, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const campRes = await axios.get(`http://localhost:5000/api/campaigns/${id}`);
      setCampaign(campRes.data);

      const donorsRes = await axios.get(`http://localhost:5000/api/donations/${id}`);
      setDonors(donorsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ textAlign: "center", paddingTop: "100px" }}>Loading campaign...</div>;
  }

  if (!campaign) {
    return <div className="container" style={{ textAlign: "center", paddingTop: "100px" }}>Campaign not found.</div>;
  }

  const progress = Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100) || 0;

  return (
    <div className="container animate-fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "40px", alignItems: "start" }}>
        {/* Left Column: Details */}
        <div>
          <span style={{ background: "rgba(0, 245, 212, 0.1)", color: "var(--accent-cyan)", padding: "6px 12px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 600, display: "inline-block", marginBottom: "16px" }}>
            {campaign.category || "General"}
          </span>
          <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>{campaign.title}</h1>
          
          <div style={{ display: "flex", alignItems: "center", gap: "20px", color: "var(--text-secondary)", marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid var(--glass-border)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><User size={18} /> {campaign.createdBy || "Anonymous"}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Calendar size={18} /> {new Date(campaign.createdDate).toLocaleDateString()}</span>
          </div>

          <div style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-primary)", whiteSpace: "pre-wrap", marginBottom: "40px" }}>
            {campaign.description}
          </div>
          
          <h3>Recent Supporters ({donors.length})</h3>
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
             {donors.length === 0 ? (
               <p style={{ color: "var(--text-secondary)" }}>Be the first to support this campaign!</p>
             ) : (
               donors.slice().reverse().map((d) => (
                 <div key={d._id} className="glass-panel" style={{ padding: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
                   <div style={{ width: "40px", height: "40px", background: "var(--gradient-cool)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
                     {d.donorName.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <div style={{ fontWeight: 600 }}>{d.donorName} <span style={{ color: "var(--accent-green)" }}>donated ${d.amount}</span></div>
                     {d.message && <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>"{d.message}"</div>}
                   </div>
                 </div>
               ))
             )}
          </div>
        </div>

        {/* Right Column: Donation Card */}
        <div className="glass-panel" style={{ padding: "30px", position: "sticky", top: "100px" }}>
           <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "8px" }}>
             <span className="text-gradient">${campaign.raisedAmount}</span>
           </div>
           <div style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
             raised of ${campaign.targetAmount} goal
           </div>
           
           <div className="progress-container" style={{ height: "12px", marginBottom: "8px" }}>
             <div className="progress-bar" style={{ width: `${progress}%` }}></div>
           </div>
           
           <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "30px" }}>
             <span>{progress.toFixed(1)}%</span>
             <span>{donors.length} donations</span>
           </div>

           <button onClick={() => navigate(`/payment/${id}`)} className="btn btn-primary" style={{ width: "100%", padding: "16px", fontSize: "1.1rem", marginBottom: "16px" }}>
             Donate Now
           </button>
           
           <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied to clipboard!"); }} className="btn btn-secondary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
             <Copy size={18} /> Share Campaign
           </button>
        </div>
      </div>
    </div>
  );
}
