import { useState, useEffect } from "react";
import Auth from "./Auth";

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

    // ONE request to get EVERYTHING
    fetch(`http://127.0.0.1:8000/api/v1/me?usr_id=${usrId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch(() => {
        handleLogout();
      });
  }, [token]);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("paperpilot_token");
    setToken(null);
    setData(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-indigo-600 font-semibold text-xl">
        Loading PaperPilot...
      </div>
    );
  }

  if (!token) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  if (!data) return null;

  const isPlatform = data.dashboard_type === "platform";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-2xl font-bold text-indigo-600 tracking-tight">
            PaperPilot
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a
            href="#"
            className="block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
          >
            Question Bank
          </a>
          {isPlatform && (
            <a
              href="#"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
            >
              Manage Tenants
            </a>
          )}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome back, {data.user.first_name}!
          </h1>
          <div className="flex items-center gap-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {isPlatform ? "Platform Admin" : data.roles[0]?.replace("_", " ")}
            </span>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {data.user.first_name[0]}
              {data.user.last_name[0]}
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isPlatform ? (
              <>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Head Offices
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.stats.total_head_offices}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Total Campuses
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.stats.total_campuses}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Total Users
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.stats.total_users}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Total Questions
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.stats.total_questions}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Upcoming Exams
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.stats.upcoming_exams}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">
                    Students Enrolled
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.stats.students_enrolled}
                  </p>
                </div>
              </>
            )}
          </div>

          {!isPlatform && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Your Contexts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.contexts?.map((ctx, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500"
                  >
                    <h3 className="text-lg font-bold text-gray-800">
                      {ctx.cam_name || ctx.head_off_name || "Global"}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {ctx.rol_name.replace("_", " ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
