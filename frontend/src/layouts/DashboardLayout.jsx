import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard":    "Dashboard",
  "/applications": "Applications",
  "/reminders":    "Reminders",
};

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "JobLog";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title={title} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;