import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement
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

      const response =
        await api.post(
          "/auth/login",
          formData
        );

      const {
        access_token,
        user,
      } = response.data;

      localStorage.setItem(
        "token",
        access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      toast.success(
        `Welcome back, ${user.name} 👋`
      );

      if (
        user.role === "admin"
      ) {

        navigate("/admin");

      } else {

        navigate("/member");

      }

    } catch (error: any) {

      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">

        <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">

          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-sm">

              <span className="text-sm font-medium">
                Team Task Manager
              </span>

            </div>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Welcome
              <br />
              Back To Your
              <br />
              Workspace
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed">
              Continue managing projects,
              tracking deadlines, and
              keeping your team orbiting
              smoothly around productivity ✨
            </p>

          </div>

          <div className="relative z-10 space-y-5">

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">

              <h3 className="font-semibold mb-2">
                🚀 Faster Collaboration
              </h3>

              <p className="text-sm text-slate-300">
                Assign tasks and monitor
                team progress in real-time.
              </p>

            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">

              <h3 className="font-semibold mb-2">
                📊 Clean Project Tracking
              </h3>

              <p className="text-sm text-slate-300">
                Track pending, completed,
                and overdue work with ease.
              </p>

            </div>

          </div>

        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">

          <div className="mb-10">

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-5">

              Secure Login

            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Sign In
            </h2>

            <p className="text-gray-500 text-lg">
              Access your dashboard and
              continue your workflow ⚡
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={
                  handleChange
                }
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
                placeholder="Enter your password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >

              {loading ? (

                <span className="flex items-center justify-center gap-3">

                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>

                  Logging In...

                </span>

              ) : (
                "Login"
              )}

            </button>

          </form>

          <div className="mt-8 text-center">

            <p className="text-gray-500">

              Don&apos;t have an account?
              {" "}

              <span
                onClick={() =>
                  navigate(
                    "/register"
                  )
                }
                className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700 transition"
              >
                Register
              </span>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}