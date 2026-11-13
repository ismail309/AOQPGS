import { useState, useEffect } from "react";

export default function PlatformAdmin() {
  const [activeTab, setActiveTab] = useState("head-offices");
  const [headOffices, setHeadOffices] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [users, setUsers] = useState([]);

  // Form States
  const [hoForm, setHoForm] = useState({
    head_off_name: "",
    email: "",
    city: "",
  });
  const [campForm, setCampForm] = useState({
    head_off_id: "",
    cam_name: "",
    city: "",
  });
  const [userForm, setUserForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_name: "teacher",
    head_off_id: "",
    cam_id: "",
  });

  // Fetch Data
  const loadData = async () => {
    const hoRes = await fetch(
      "http://127.0.0.1:8000/api/v1/platform/head-offices",
    );
    setHeadOffices(await hoRes.json());

    const campRes = await fetch(
      "http://127.0.0.1:8000/api/v1/platform/campuses",
    );
    setCampuses(await campRes.json());

    const usrRes = await fetch("http://127.0.0.1:8000/api/v1/platform/users");
    setUsers(await usrRes.json());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateHO = async (e) => {
    e.preventDefault();
    await fetch("http://127.0.0.1:8000/api/v1/platform/head-offices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hoForm),
    });
    setHoForm({ head_off_name: "", email: "", city: "" });
    loadData();
  };

  const handleCreateCampus = async (e) => {
    e.preventDefault();
    await fetch("http://127.0.0.1:8000/api/v1/platform/campuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campForm),
    });
    setCampForm({ head_off_id: "", cam_name: "", city: "" });
    loadData();
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    await fetch("http://127.0.0.1:8000/api/v1/platform/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    });
    setUserForm({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role_name: "teacher",
      head_off_id: "",
      cam_id: "",
    });
    loadData();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Platform Management
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {["head-offices", "campuses", "users"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-6 font-medium capitalize ${activeTab === tab ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-500"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* HEAD OFFICES TAB */}
      {activeTab === "head-offices" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1">
            <h2 className="text-lg font-bold mb-4">Add Head Office</h2>
            <form onSubmit={handleCreateHO} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full p-2 border rounded"
                value={hoForm.head_off_name}
                onChange={(e) =>
                  setHoForm({ ...hoForm, head_off_name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={hoForm.email}
                onChange={(e) =>
                  setHoForm({ ...hoForm, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="City"
                className="w-full p-2 border rounded"
                value={hoForm.city}
                onChange={(e) => setHoForm({ ...hoForm, city: e.target.value })}
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-2 rounded"
              >
                Save
              </button>
            </form>
          </div>
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-medium text-gray-600">Name</th>
                  <th className="p-4 font-medium text-gray-600">Email</th>
                  <th className="p-4 font-medium text-gray-600">City</th>
                </tr>
              </thead>
              <tbody>
                {headOffices.map((ho) => (
                  <tr key={ho.head_off_id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{ho.head_off_name}</td>
                    <td className="p-4">{ho.email || "-"}</td>
                    <td className="p-4">{ho.city || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CAMPUSES TAB */}
      {activeTab === "campuses" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1">
            <h2 className="text-lg font-bold mb-4">Add Campus</h2>
            <form onSubmit={handleCreateCampus} className="space-y-4">
              <select
                required
                className="w-full p-2 border rounded"
                value={campForm.head_off_id}
                onChange={(e) =>
                  setCampForm({ ...campForm, head_off_id: e.target.value })
                }
              >
                <option value="">Select Head Office</option>
                {headOffices.map((ho) => (
                  <option key={ho.head_off_id} value={ho.head_off_id}>
                    {ho.head_off_name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Campus Name"
                required
                className="w-full p-2 border rounded"
                value={campForm.cam_name}
                onChange={(e) =>
                  setCampForm({ ...campForm, cam_name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="City"
                className="w-full p-2 border rounded"
                value={campForm.city}
                onChange={(e) =>
                  setCampForm({ ...campForm, city: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-2 rounded"
              >
                Save
              </button>
            </form>
          </div>
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-medium text-gray-600">Campus</th>
                  <th className="p-4 font-medium text-gray-600">Head Office</th>
                  <th className="p-4 font-medium text-gray-600">City</th>
                </tr>
              </thead>
              <tbody>
                {campuses.map((c) => (
                  <tr key={c.cam_id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{c.cam_name}</td>
                    <td className="p-4">{c.head_off_name}</td>
                    <td className="p-4">{c.city || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1">
            <h2 className="text-lg font-bold mb-4">Add User</h2>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <input
                type="text"
                placeholder="First Name"
                required
                className="w-full p-2 border rounded"
                value={userForm.first_name}
                onChange={(e) =>
                  setUserForm({ ...userForm, first_name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                required
                className="w-full p-2 border rounded"
                value={userForm.last_name}
                onChange={(e) =>
                  setUserForm({ ...userForm, last_name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-2 border rounded"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full p-2 border rounded"
                value={userForm.password}
                onChange={(e) =>
                  setUserForm({ ...userForm, password: e.target.value })
                }
              />

              <select
                required
                className="w-full p-2 border rounded"
                value={userForm.role_name}
                onChange={(e) =>
                  setUserForm({ ...userForm, role_name: e.target.value })
                }
              >
                <option value="teacher">Teacher</option>
                <option value="campus_admin">Campus Admin</option>
                <option value="organisation_admin">Organisation Admin</option>
              </select>

              {userForm.role_name !== "platform_admin" && (
                <select
                  required
                  className="w-full p-2 border rounded"
                  value={userForm.head_off_id}
                  onChange={(e) =>
                    setUserForm({ ...userForm, head_off_id: e.target.value })
                  }
                >
                  <option value="">Select Head Office</option>
                  {headOffices.map((ho) => (
                    <option key={ho.head_off_id} value={ho.head_off_id}>
                      {ho.head_off_name}
                    </option>
                  ))}
                </select>
              )}

              {(userForm.role_name === "teacher" ||
                userForm.role_name === "campus_admin") && (
                <select
                  className="w-full p-2 border rounded"
                  value={userForm.cam_id}
                  onChange={(e) =>
                    setUserForm({ ...userForm, cam_id: e.target.value })
                  }
                >
                  <option value="">Select Campus (Optional)</option>
                  {campuses
                    .filter(
                      (c) =>
                        c.head_off_name ===
                        headOffices.find(
                          (h) => h.head_off_id == userForm.head_off_id,
                        )?.head_off_name,
                    )
                    .map((c) => (
                      <option key={c.cam_id} value={c.cam_id}>
                        {c.cam_name}
                      </option>
                    ))}
                </select>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-2 rounded"
              >
                Save User
              </button>
            </form>
          </div>
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-medium text-gray-600">Name</th>
                  <th className="p-4 font-medium text-gray-600">Email</th>
                  <th className="p-4 font-medium text-gray-600">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.usr_id} className="border-b last:border-0">
                    <td className="p-4 font-medium">
                      {u.first_name} {u.last_name}
                    </td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4 capitalize">
                      {u.roles ? u.roles.replace(/_/g, " ") : "No Role"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
