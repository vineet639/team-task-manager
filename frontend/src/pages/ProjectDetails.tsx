import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

export default function ProjectDetails() {

  const navigate = useNavigate();

  const { id } = useParams();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [loading, setLoading] =
    useState(true);

  const [project, setProject] =
    useState<any>(null);

  const [tasks, setTasks] =
    useState<any[]>([]);

  const [showTaskModal, setShowTaskModal] =
    useState(false);

  const [showMemberModal, setShowMemberModal] =
    useState(false);

  const [memberUserId, setMemberUserId] =
    useState("");

  const [taskTitle, setTaskTitle] =
    useState("");

  const [taskDescription,
    setTaskDescription] =
    useState("");

  const [priority, setPriority] =
    useState("medium");

  const [assignedTo, setAssignedTo] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const fetchProjectDetails =
    async () => {

      try {

        setLoading(true);

        const projectsResponse =
          await api.get("/projects/");

        const selectedProject =
          projectsResponse.data.projects.find(
            (p: any) =>
              p.id === Number(id)
          );

        setProject(selectedProject);

        const tasksResponse =
          await api.get("/tasks/");

        const filteredTasks =
          tasksResponse.data.tasks.filter(
            (task: any) =>
              task.project_id ===
              Number(id)
          );

        setTasks(filteredTasks);

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to load project"
        );

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");
  };

  const handleAddMember = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await api.post(
        `/projects/${id}/members`,
        {
          user_id:
            Number(memberUserId),
        }
      );

      setMemberUserId("");

      setShowMemberModal(false);

      toast.success(
        "Member added successfully"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to add member"
      );
    }
  };

  const handleCreateTask = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      await api.post("/tasks/", {

        title: taskTitle,

        description:
          taskDescription,

        project_id: Number(id),

        assigned_to:
          assignedTo
            ? Number(assignedTo)
            : null,

        priority,

        due_date:
          dueDate || null,
      });

      toast.success(
        "Task created successfully"
      );

      setTaskTitle("");

      setTaskDescription("");

      setPriority("medium");

      setAssignedTo("");

      setDueDate("");

      setShowTaskModal(false);

      fetchProjectDetails();

    } catch (error: any) {

      console.error(
        error.response?.data
      );

      toast.error(
        error.response?.data
          ?.message ||
        "Failed to create task"
      );
    }
  };

  const totalTasks = tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "done"
    ).length;

  const pendingTasks =
    totalTasks -
    completedTasks;

  const progress =
    totalTasks > 0
      ? Math.round(
          (
            completedTasks /
            totalTasks
          ) * 100
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>

          <h2 className="text-2xl font-bold text-gray-700">
            Loading Project...
          </h2>

          <p className="text-gray-500 mt-2">
            Fetching project details
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
            Project Details
          </h1>

          <p className="text-sm text-gray-500">
            Welcome,
            {" "}
            {user?.name || "Admin"}
          </p>

        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              setShowMemberModal(
                true
              )
            }
            className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition shadow"
          >
            + Add Member
          </button>

          <button
            onClick={() =>
              setShowTaskModal(
                true
              )
            }
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow"
          >
            + Create Task
          </button>

          <button
            onClick={() =>
              navigate("/admin")
            }
            className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            Back
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

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-10">

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {project?.title}
          </h1>

          <p className="text-gray-600 text-lg">
            {project?.description}
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <h2 className="text-gray-500 mb-2">
              Total Tasks
            </h2>

            <p className="text-4xl font-bold text-blue-700">
              {totalTasks}
            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <h2 className="text-gray-500 mb-2">
              Completed
            </h2>

            <p className="text-4xl font-bold text-green-600">
              {completedTasks}
            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <h2 className="text-gray-500 mb-2">
              Pending
            </h2>

            <p className="text-4xl font-bold text-orange-500">
              {pendingTasks}
            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">

            <h2 className="text-gray-500 mb-2">
              Progress
            </h2>

            <p className="text-4xl font-bold text-purple-600">
              {progress}%
            </p>

          </div>

        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="px-8 py-6 border-b border-gray-100">

            <h2 className="text-3xl font-bold">
              Tasks
            </h2>

            <p className="text-gray-500 mt-1">
              Monitor project tasks and submissions
            </p>

          </div>

          {tasks.length === 0 ? (

            <div className="p-16 text-center">

              <h3 className="text-3xl font-bold mb-4 text-gray-800">
                No Tasks Found
              </h3>

              <p className="text-gray-500 mb-8">
                Create your first task to get started.
              </p>

              <button
                onClick={() =>
                  setShowTaskModal(
                    true
                  )
                }
                className="px-8 py-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition shadow"
              >
                Create Task
              </button>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-100 border-b border-gray-200">

                  <tr>

                    <th className="text-left px-6 py-4 text-gray-600 font-semibold">
                      Sr No
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600 font-semibold">
                      Task
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600 font-semibold">
                      Priority
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600 font-semibold">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600 font-semibold">
                      Due Date
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600 font-semibold">
                      Assigned To
                    </th>

                    <th className="text-left px-6 py-4 text-gray-600 font-semibold">
                      Submission
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {tasks.map(
                    (task, index) => (

                      <tr
                        key={task.id}
                        className="border-b border-gray-100 hover:bg-slate-50 transition"
                      >

                        <td className="px-6 py-5 font-medium">
                          {index + 1}
                        </td>

                        <td className="px-6 py-5">

                          <div>

                            <h3 className="font-semibold text-gray-800">
                              {task.title}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {task.description}
                            </p>

                          </div>

                        </td>

                        <td className="px-6 py-5">

                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm capitalize">
                            {task.priority}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              task.status ===
                              "done"
                                ? "bg-green-100 text-green-700"
                                : task.status ===
                                  "in_progress"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {task.status}
                          </span>

                        </td>

                        <td className="px-6 py-5 text-gray-600">

                          {task.due_date
                            ? new Date(
                                task.due_date
                              ).toLocaleString()
                            : "No Deadline"}

                        </td>

                        <td className="px-6 py-5 text-gray-600">

                          {task.assigned_user_name ||
                            "Unassigned"}

                        </td>

                        <td className="px-6 py-5">

                          {task.submission_url ? (

                            <a
                              href={
                                task.submission_url
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              View Submission
                            </a>

                          ) : (

                            <span className="text-gray-400">
                              No Submission
                            </span>
                          )}

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {showMemberModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-3xl font-bold">
                Add Member
              </h2>

              <button
                onClick={() =>
                  setShowMemberModal(
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
                handleAddMember
              }
              className="space-y-5"
            >

              <input
                type="number"
                placeholder="Enter User ID"
                value={memberUserId}
                onChange={(e) =>
                  setMemberUserId(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition shadow font-semibold"
              >
                Add Member
              </button>

            </form>

          </div>

        </div>
      )}

      {showTaskModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-3xl font-bold">
                Create Task
              </h2>

              <button
                onClick={() =>
                  setShowTaskModal(
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
                handleCreateTask
              }
              className="space-y-5"
            >

              <input
                type="text"
                placeholder="Task Title"
                value={taskTitle}
                onChange={(e) =>
                  setTaskTitle(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <textarea
                placeholder="Task Description"
                value={taskDescription}
                onChange={(e) =>
                  setTaskDescription(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={4}
              />

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >

                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>

                <option value="urgent">
                  Urgent
                </option>

              </select>

              <input
                type="number"
                placeholder="Assign To User ID"
                value={assignedTo}
                onChange={(e) =>
                  setAssignedTo(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(
                    e.target.value
                  )
                }
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition shadow font-semibold"
              >
                Create Task
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}