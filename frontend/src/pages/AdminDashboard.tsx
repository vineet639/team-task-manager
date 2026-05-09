import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [projects, setProjects] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [showProfileModal,
    setShowProfileModal] =
    useState(false);

  const fetchProjects = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/projects/");

      setProjects(
        response.data.projects
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load projects"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");
  };

  const handleCreateProject = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await api.post("/projects/", {
        title,
        description,
      });

      toast.success(
        "Project created successfully"
      );

      setTitle("");

      setDescription("");

      setShowModal(false);

      fetchProjects();

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to create project"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>

          <h2 className="text-2xl font-bold text-gray-700">
            Loading Dashboard...
          </h2>

          <p className="text-gray-500 mt-2">
            Fetching your projects
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <nav className="bg-blue-50 border-b border-blue-100 px-8 py-5 flex items-center justify-between shadow-sm">

        <div>

          <h1 className="text-2xl font-bold text-blue-700">
            Team Task Manager
          </h1>

          <p className="text-sm text-gray-500">
            Welcome, {user?.name || "Admin"}
          </p>

        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              setShowProfileModal(true)
            }
            className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg hover:scale-105 transition"
          >
            {user?.name
              ? user.name
                  .charAt(0)
                  .toUpperCase()
              : "A"}
          </button>

          <button
            onClick={() =>
              setShowModal(true)
            }
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow"
          >
            + Create Project
          </button>

          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-8">

          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Projects
          </h2>

          <p className="text-gray-500">
            Manage all created projects
          </p>

        </div>

        {projects.length === 0 ? (

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">

            <h3 className="text-3xl font-bold mb-4 text-gray-800">
              No Projects Found
            </h3>

            <p className="text-gray-500 mb-8">
              Create your first project to get started.
            </p>

            <button
              onClick={() =>
                setShowModal(true)
              }
              className="px-8 py-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition shadow"
            >
              Create Project
            </button>

          </div>

        ) : (

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-100 border-b border-gray-200">

                  <tr>

                    <th className="text-left px-6 py-4 text-gray-600 font-semibold">
                      Sr No
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600 font-semibold">
                      Title
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600 font-semibold">
                      Description
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600 font-semibold">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {projects.map(
                    (project, index) => (
                      <tr
                        key={project.id}
                        className="border-b border-gray-100 hover:bg-slate-50 transition"
                      >

                        <td className="px-6 py-5 font-medium">
                          {index + 1}
                        </td>

                        <td className="px-6 py-5 font-semibold text-gray-800">
                          {project.title}
                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {project.description}
                        </td>

                        <td className="px-6 py-5">

                          <button
                            onClick={() =>
                              navigate(
                                `/project/${project.id}`
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          >
                            View More
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

            <div className="flex items-center justify-between mb-8">

              <h2 className="text-3xl font-bold">
                Admin Profile
              </h2>

              <button
                onClick={() =>
                  setShowProfileModal(false)
                }
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>

            </div>

            <div className="flex justify-center mb-8">

              <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                {user?.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "A"}
              </div>

            </div>

            <div className="space-y-5">

              <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100">

                <p className="text-sm text-gray-500 mb-1">
                  User ID
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  {user?.id || "N/A"}
                </h3>

              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100">

                <p className="text-sm text-gray-500 mb-1">
                  Name
                </p>

                <h3 className="text-lg font-semibold text-gray-800">
                  {user?.name || "N/A"}
                </h3>

              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100">

                <p className="text-sm text-gray-500 mb-1">
                  Email
                </p>

                <h3 className="text-lg font-semibold text-gray-800 break-all">
                  {user?.email || "N/A"}
                </h3>

              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100">

                <p className="text-sm text-gray-500 mb-1">
                  Role
                </p>

                <h3 className="text-lg font-semibold text-blue-700 capitalize">
                  {user?.role || "admin"}
                </h3>

              </div>

            </div>

          </div>

        </div>
      )}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-3xl font-bold">
                Create Project
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={
                handleCreateProject
              }
              className="space-y-5"
            >

              <input
                type="text"
                placeholder="Project Title"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <textarea
                placeholder="Project Description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={5}
              />

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition shadow font-semibold"
              >
                Create Project
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}