import { useState, useEffect } from 'react';
import Auth from './Auth';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('paperpilot_token'));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to extract the user ID from the JWT
  const getUserIdFromToken = (jwtToken) => {
    try {
      const payload = JSON.parse(atob(jwtToken.split('.')[1]));
      return payload.sub; // The 'sub' field contains the usr_id we set in FastAPI
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

    // Fetch dashboard data using the decoded ID
    fetch(`http://127.0.0.1:8000/api/v1/dashboard?usr_id=${usrId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        handleLogout(); // If token is invalid, log out
      });
  }, [token]);

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('paperpilot_token');
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

  // If no token, show the Login/Register screen
  if (!token) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  // If token exists but data hasn't loaded yet
  if (!data) return null;

  // If logged in, render the Dashboard
  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-2xl font-bold text-indigo-600 tracking-tight">PaperPilot</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
            Dashboard
          </a>
          <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
            Question Bank
          </a>
          <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
            Examinations
          </a>
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
              {data.roles[0]?.rol_name.replace('_', ' ') || 'User'}
            </span>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {data.user.first_name[0]}{data.user.last_name[0]}
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Total Questions</h3>
              <p className="text-3xl font-bold text-gray-900">{data.stats.total_questions}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Upcoming Exams</h3>
              <p className="text-3xl font-bold text-gray-900">{data.stats.upcoming_exams}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Students Enrolled</h3>
              <p className="text-3xl font-bold text-gray-900">{data.stats.students_enrolled}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Contexts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.roles.map((role, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500">
                  <h3 className="text-lg font-bold text-gray-800">{role.cam_name || role.head_off_name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{role.rol_name.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}