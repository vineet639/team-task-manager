import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

export default function MemberDashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<any>(null);

  const [tasks, setTasks] =
    useState<any[]>([]);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedTask,
    setSelectedTask] =
    useState<any>(null);

  const [status, setStatus] =
    useState("todo");

  const [showProfileModal, setShowProfileModal] =
    useState(false);

  const [submissionUrl,
    setSubmissionUrl] =
    useState("");

  const fetchDashboardData =
    async () => {

      try {

        setLoading(true);

        const statsResponse =
          await api.get(
            "/dashboard/stats"
          );

        setStats(
          statsResponse.data
        );

        const tasksResponse =
          await api.get("/tasks/");

        setTasks(
          tasksResponse.data.tasks
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");
  };

  const openUpdateModal = (
    task: any
  ) => {

    const isExpired =
      task.due_date &&
      new Date(task.due_date) <
        new Date();

    if (
      isExpired &&
      task.status !== "done"
    ) {

      toast.error(
        "Task deadline has passed ⏰"
      );

      return;
    }

    setSelectedTask(task);

    setStatus(task.status);

    setSubmissionUrl(
      task.submission_url || ""
    );

    setShowModal(true);
  };

  const handleStatusUpdate =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      try {

        await api.put(
          `/tasks/${selectedTask.id}/status`,
          {
            status,

            submission_url:
              status === "done"
                ? submissionUrl
                : null,
          }
        );

        toast.success(
          "Task updated successfully 🚀"
        );

        setShowModal(false);

        fetchDashboardData();

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to update task"
        );
      }
    };

  const ongoingTasks =
    tasks.filter(
      (task) => {

        const isExpired =
          task.due_date &&
          new Date(
            task.due_date
          ) < new Date();

        return (
          task.status !== "done" &&
          !isExpired
        );
      }
    );

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "done"
    );

  const overdueTasks =
    tasks.filter(
      (task) => {

        const isExpired =
          task.due_date &&
          new Date(
            task.due_date
          ) < new Date();

        return (
          task.status !== "done" &&
          isExpired
        );
      }
    );

  const renderTaskCard = (
    task: any,
    overdue = false
  ) => (

    <div
      key={task.id}
      className={`border rounded-3xl p-6 transition shadow-sm ${
        overdue
          ? "border-red-200 bg-red-50"
          : "border-gray-100 bg-slate-50 hover:bg-white"
      }`}
    >

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-3 mb-3">

            <h3 className="text-2xl font-bold text-gray-800">
              {task.title}
            </h3>

            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm capitalize">
              {task.priority}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                task.status === "done"
                  ? "bg-green-100 text-green-700"
                  : task.status ===
                    "in_progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {task.status}
            </span>

            {overdue && (
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                Overdue
              </span>
            )}

          </div>

          <p className="text-gray-600 mb-4">
            {task.description}
          </p>

          <div className="flex flex-wrap gap-5 text-sm text-gray-500">

            <p>
              📁
              {" "}
              {task.project_title ||
                "Project"}
            </p>

            <p>
              ⏳
              {" "}
              {task.due_date
                ? new Date(
                    task.due_date
                  ).toLocaleString()
                : "No Deadline"}
            </p>

          </div>

          {task.submission_url && (
            <a
              href={
                task.submission_url
              }
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 text-blue-600 underline text-sm hover:text-blue-800"
            >
              View Submission
            </a>
          )}

        </div>

        <div>

          {overdue ? (

            <div className="px-5 py-3 rounded-2xl bg-red-100 text-red-700 font-medium">
              Deadline Passed
            </div>

          ) : (

            <button
              onClick={() =>
                openUpdateModal(
                  task
                )
              }
              className="px-6 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition shadow"
            >
              Update Task
            </button>
          )}

        </div>

      </div>

    </div>
  );

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>

          <h2 className="text-2xl font-bold text-gray-700">
            Loading Dashboard...
          </h2>

          <p className="text-gray-500 mt-2">
            Gathering your tasks ✨
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <nav className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm">

        <div>

          <h1 className="text-2xl font-bold text-blue-700">
            Member Dashboard
          </h1>

          <p className="text-gray-500">
            Welcome,
            {" "}
            {user?.name || "Member"}
          </p>

        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              setShowProfileModal(true)
            }
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow hover:bg-blue-700 transition"
          >
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "M"}
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <h2 className="text-gray-500 mb-2">
              Total Tasks
            </h2>

            <p className="text-4xl font-bold text-blue-700">
              {stats?.total_tasks || 0}
            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <h2 className="text-gray-500 mb-2">
              Completed
            </h2>

            <p className="text-4xl font-bold text-green-600">
              {stats?.completed_tasks || 0}
            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <h2 className="text-gray-500 mb-2">
              Pending
            </h2>

            <p className="text-4xl font-bold text-orange-500">
              {stats?.pending_tasks || 0}
            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <h2 className="text-gray-500 mb-2">
              Progress
            </h2>

            <p className="text-4xl font-bold text-purple-600">
              {stats?.progress || 0}%
            </p>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">

          <div className="mb-8">

            <h2 className="text-3xl font-bold">
              Ongoing Tasks
            </h2>

            <p className="text-gray-500 mt-1">
              Tasks currently in motion ⚡
            </p>

          </div>

          {ongoingTasks.length === 0 ? (

            <p className="text-gray-500">
              No ongoing tasks
            </p>

          ) : (

            <div className="space-y-6">

              {ongoingTasks.map(
                (task) =>
                  renderTaskCard(
                    task
                  )
              )}

            </div>
          )}

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10">

          <div className="mb-8">

            <h2 className="text-3xl font-bold">
              Completed Tasks
            </h2>

            <p className="text-gray-500 mt-1">
              Finished missions 🎯
            </p>

          </div>

          {completedTasks.length === 0 ? (

            <p className="text-gray-500">
              No completed tasks
            </p>

          ) : (

            <div className="space-y-6">

              {completedTasks.map(
                (task) =>
                  renderTaskCard(
                    task
                  )
              )}

            </div>
          )}

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-red-100">

          <div className="mb-8">

            <h2 className="text-3xl font-bold text-red-600">
              Overdue Tasks
            </h2>

            <p className="text-gray-500 mt-1">
              Time escaped these tasks ⌛
            </p>

          </div>

          {overdueTasks.length === 0 ? (

            <p className="text-gray-500">
              No overdue tasks
            </p>

          ) : (

            <div className="space-y-6">

              {overdueTasks.map(
                (task) =>
                  renderTaskCard(
                    task,
                    true
                  )
              )}

            </div>
          )}

        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-3xl font-bold">
                Update Task
              </h2>

              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={
                handleStatusUpdate
              }
              className="space-y-5"
            >

              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >

                  <option value="todo">
                    Todo
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="done">
                    Done
                  </option>

                </select>

              </div>

              {status === "done" && (

                <div>

                  <label className="block mb-2 font-medium text-gray-700">
                    Submission URL
                  </label>

                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={
                      submissionUrl
                    }
                    onChange={(e) =>
                      setSubmissionUrl(
                        e.target
                          .value
                      )
                    }
                    className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />

                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition shadow font-semibold"
              >
                Update Task
              </button>

            </form>

          </div>

        </div>
      )}

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

            <div className="flex items-center justify-between mb-8">

              <h2 className="text-3xl font-bold">
                My Profile
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
                  : "M"}
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
                  {user?.role || "member"}
                </h3>

              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}