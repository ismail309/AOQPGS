import { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded for now: Sara's ID (2)
  const CURRENT_USER_ID = 2;

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/v1/dashboard?usr_id=${CURRENT_USER_ID}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-indigo-600 font-semibold text-xl">
        Loading your cozy dashboard...
      </div>
    );
  }

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
          <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
            Students
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {data.user.first_name[0]}{data.user.last_name[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{data.user.first_name} {data.user.last_name}</p>
              <p className="text-xs text-gray-500">{data.user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome back, {data.user.first_name}!
          </h1>
          <div className="flex items-center gap-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              {data.roles[0].rol_name.replace('_', ' ')}
            </span>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="p-8 space-y-8">
          
          {/* STATS GRID */}
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

          {/* ROLES / CONTEXTS */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Contexts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.roles.map((role, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500">
                  <h3 className="text-lg font-bold text-gray-800">{role.cam_name}</h3>
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