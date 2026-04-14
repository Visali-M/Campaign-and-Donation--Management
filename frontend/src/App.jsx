import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignDetails from "./pages/CampaignDetails";
import Payment from "./pages/Payment";

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e1e2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <Navbar />
      <div className="page-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<CreateCampaign />} />
          <Route path="/campaign/:id" element={<CampaignDetails />} />
          <Route path="/payment/:campaignId" element={<Payment />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
