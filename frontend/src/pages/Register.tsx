import { useState } from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

export default function Register() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const defaultRole =
    searchParams.get("role") ||
    "member";

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: defaultRole,
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<
      HTMLFormElement
    >
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      await api.post(
        "/auth/register",
        formData
      );

      toast.success(
        "Account created successfully 🎉"
      );

      navigate("/login");

    } catch (error: any) {

      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
        "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">

        <div className="hidden lg:flex flex-col justify-between bg-blue-600 text-white p-12 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-30"></div>

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-sm">

              <span className="text-sm font-medium">
                Team Task Manager
              </span>

            </div>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Build Teams.
              <br />
              Ship Work.
              <br />
              Stay Aligned.
            </h1>

            <p className="text-blue-100 text-lg leading-relaxed">
              Create projects, assign tasks,
              track progress, and keep your
              workflow flowing like a neatly
              organized command center ✨
            </p>

          </div>

          <div className="relative z-10 space-y-5">

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">

              <h3 className="font-semibold mb-2">
                📁 Smart Project Management
              </h3>

              <p className="text-sm text-blue-100">
                Organize projects with clean
                workflows and role-based access.
              </p>

            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">

              <h3 className="font-semibold mb-2">
                ⚡ Real-Time Task Tracking
              </h3>

              <p className="text-sm text-blue-100">
                Monitor deadlines, submissions,
                and team progress with ease.
              </p>

            </div>

          </div>

        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">

          <div className="mb-10">

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-5">

              {formData.role === "admin"
                ? "Admin Registration"
                : "Member Registration"}

            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Create Account
            </h2>

            <p className="text-gray-500 text-lg">
              Start managing projects and tasks
              in your digital workspace 🚀
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />

            </div>

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />

            </div>

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />

            </div>

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Account Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >

                <option value="admin">
                  Admin
                </option>

                <option value="member">
                  Member
                </option>

              </select>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >

              {loading ? (
                <span className="flex items-center justify-center gap-3">

                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>

                  Creating Account...

                </span>
              ) : (
                "Create Account"
              )}

            </button>

          </form>

          <div className="mt-8 text-center">

            <p className="text-gray-500">

              Already have an account?
              {" "}

              <span
                onClick={() =>
                  navigate("/login")
                }
                className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700 transition"
              >
                Login
              </span>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}