import { NavLink } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

const navItems = [
  { label: "Dashboard",    path: "/dashboard"    },
  { label: "Applications", path: "/applications" },
  { label: "Reminders",    path: "/reminders"    },
];

const Sidebar = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      logout();
    }
  };

  return (
    <div className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col py-6 px-4">
      {/* logo */}
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-indigo-600">JobLog</h1>
        <p className="text-xs text-gray-400 mt-1">Job tracker</p>
      </div>

      {/* nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* logout */}
      <button
        onClick={handleLogout}
        className="mt-auto px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg text-left border-2 font-bold"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;