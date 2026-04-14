import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CreditCard, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function Payment() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/campaigns/${campaignId}`);
        setCampaign(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [campaignId]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : { name: "Anonymous Donor" };
        
        await axios.post("http://localhost:5000/api/donations", {
          campaignId: campaignId,
          donorName: user.name,
          amount: Number(amount),
          message: message
        });
        
        setSuccess(true);
      } catch (err) {
        toast.error("Payment failed. Please try again.");
      } finally {
        setProcessing(false);
      }
    }, 1500);
  };

  if (loading) {
    return <div className="container" style={{ textAlign: "center", paddingTop: "100px" }}>Loading secure payment...</div>;
  }

  if (!campaign) {
    return <div className="container" style={{ textAlign: "center", paddingTop: "100px" }}>Campaign not found.</div>;
  }

  if (success) {
    return (
      <div className="container animate-fade-in" style={{ display: "flex", justifyContent: "center", paddingTop: "60px" }}>
        <div className="glass-panel" style={{ padding: "40px", maxWidth: "500px", width: "100%", textAlign: "center" }}>
          <CheckCircle size={64} color="var(--accent-green)" style={{ margin: "0 auto 20px" }} />
          <h2 style={{ marginBottom: "16px" }}>Payment Successful!</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "30px", lineHeight: "1.6" }}>
            Thank you for supporting <strong>{campaign.title}</strong>.<br />
            Your donation of ${amount} makes a big difference!
          </p>
          <button onClick={() => navigate(`/campaign/${campaignId}`)} className="btn btn-primary" style={{ width: "100%" }}>
            Return to Campaign
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: "800px", paddingTop: "40px", margin: "0 auto" }}>
      <button 
        onClick={() => navigate(`/campaign/${campaignId}`)} 
        style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", marginBottom: "30px", fontSize: "1rem" }}
      >
        <ArrowLeft size={20} /> Back to Campaign
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>
        <div className="glass-panel" style={{ padding: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid var(--glass-border)" }}>
            <div>
              <h2 style={{ marginBottom: "8px" }}>Secure Checkout</h2>
              <div style={{ color: "var(--text-secondary)" }}>Supporting: <span style={{ color: "var(--accent-cyan)", fontWeight: 500 }}>{campaign.title}</span></div>
            </div>
            <Lock size={28} color="var(--accent-green)" />
          </div>

          <form onSubmit={handlePayment} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Donation Amount */}
            <div style={{ padding: "20px", background: "rgba(0,0,0,0.2)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
              <h4 style={{ marginBottom: "16px", color: "var(--text-primary)" }}>Donation Details</h4>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label>Amount ($)</label>
                <input type="number" min="1" required className="glass-input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
              </div>
              <div className="form-group">
                <label>Message of Support (Optional)</label>
                <input type="text" className="glass-input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Leave a message for the organizer" />
              </div>
            </div>

            {/* Payment Details */}
            <div style={{ padding: "20px", background: "rgba(0,0,0,0.2)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
              <h4 style={{ marginBottom: "16px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                <CreditCard size={20} color="var(--accent-pink)" />
                Payment Information
              </h4>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label>Card Number</label>
                <input type="text" required className="glass-input" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" maxLength="19" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="text" required className="glass-input" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" maxLength="5" />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input type="text" required className="glass-input" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" maxLength="4" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={processing || !amount} className="btn btn-primary" style={{ padding: "16px", fontSize: "1.2rem", marginTop: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {processing ? (
                <span>Processing...</span>
              ) : (
                <span>Pay ${amount || "0.00"}</span>
              )}
            </button>
            <div style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "10px" }}>
              Payments are simulated for this demo application.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
