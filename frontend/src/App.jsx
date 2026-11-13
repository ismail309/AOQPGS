// frontend/src/App.jsx
import { useState, useEffect } from "react";
import Auth from "./Auth";
import TenantLayout from "./TenantLayout";
import PlatformLayout from "./PlatformLayout";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("paperpilot_token"));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserIdFromToken = (jwtToken) => {
    try {
      const payload = JSON.parse(atob(jwtToken.split(".")[1]));
      return payload.sub;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const usrId = getUserIdFromToken(token);
    if (!usrId) {
      handleLogout();
      return;
    }

    fetch(`http://127.0.0.1:8000/api/v1/me?usr_id=${usrId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch(() => handleLogout());
  }, [token]);

  const handleLoginSuccess = (newToken) => setToken(newToken);

  const handleLogout = () => {
    localStorage.removeItem("paperpilot_token");
    setToken(null);
    setData(null);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-indigo-600 font-bold">
        Loading PaperPilot...
      </div>
    );
  if (!token) return <Auth onLoginSuccess={handleLoginSuccess} />;
  if (!data) return null;

  // THE MAGIC ROUTER
  if (data.dashboard_type === "platform") {
    return <PlatformLayout user={data.user} onLogout={handleLogout} />;
  }

  return <TenantLayout data={data} onLogout={handleLogout} />;
}
