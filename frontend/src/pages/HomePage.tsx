import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      
      <nav className="flex items-center justify-between px-8 py-5 bg-blue-50 border-b border-blue-100 shadow-sm">

        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            Team Task Manager
          </h1>

          <p className="text-sm text-gray-500">
            Organize projects & teams efficiently
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-xl border border-blue-200 hover:bg-blue-100 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow"
          >
            Register
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        
        <h1 className="text-6xl font-bold leading-tight mb-6">
          Manage Projects.
          <br />
          Assign Tasks.
          <br />
          Track Progress.
        </h1>

        <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-12">
          A collaborative team management platform where admins
          can create projects, assign tasks, and monitor progress,
          while members stay updated with their assigned work.
        </p>

        <div className="flex flex-wrap justify-center gap-5">
          
          <button
            onClick={() => navigate("/register?role=admin")}
            className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Register as Admin
          </button>

          <button
            onClick={() => navigate("/register?role=member")}
            className="px-8 py-4 rounded-2xl border border-gray-300 bg-white hover:bg-gray-100 transition"
          >
            Register as Member
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition">
            
            <h2 className="text-3xl font-bold mb-6 text-blue-700">
              Admin Features
            </h2>

            <div className="space-y-4 text-gray-700">
              <p>✔ Create and manage projects</p>
              <p>✔ Add project members</p>
              <p>✔ Assign tasks to teams</p>
              <p>✔ Track task completion</p>
              <p>✔ Monitor overall progress</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-xl transition">
            
            <h2 className="text-3xl font-bold mb-6 text-blue-700">
              Member Features
            </h2>

            <div className="space-y-4 text-gray-700">
              <p>✔ View assigned tasks</p>
              <p>✔ Update task status</p>
              <p>✔ Track project deadlines</p>
              <p>✔ Monitor work progress</p>
              <p>✔ Collaborate efficiently</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}