// import useAuth from "../hooks/useAuth";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ title }) => {
  const { user } = useAuth();

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-semibold">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="text-sm text-gray-600">{user?.name || "User"}</span>
      </div>
    </div>
  );
};

export default Navbar;