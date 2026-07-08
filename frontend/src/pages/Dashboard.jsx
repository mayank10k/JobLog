import { useState, useEffect } from "react";
import { getStats } from "../services/statsService";
import { getAllJobs } from "../services/jobService";
import StatCard from "../components/dashboard/StatCard";
import RecentJobs from "../components/dashboard/RecentJobs";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#22c55e", "#ef4444"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, jobsData] = await Promise.all([
          getStats(),
          getAllJobs(),
        ]);
        setStats(statsData);
        setJobs(jobsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  const chartData = [
    { name: "Applied",   value: stats?.Applied   || 0 },
    { name: "Interview", value: stats?.Interview  || 0 },
    { name: "Offer",     value: stats?.Offer      || 0 },
    { name: "Rejected",  value: stats?.Rejected   || 0 },
  ].filter((d) => d.value > 0);

  const responseRate = stats?.total
    ? Math.round(((stats.Interview + stats.Offer) / stats.total) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applied"
          value={stats?.total || 0}
          subtitle="all time"
          color="indigo"
        />
        <StatCard
          title="Interviews"
          value={stats?.Interview || 0}
          subtitle={`${responseRate}% response rate`}
          color="purple"
        />
        <StatCard
          title="Offers"
          value={stats?.Offer || 0}
          subtitle="keep going!"
          color="green"
        />
        <StatCard
          title="Rejected"
          value={stats?.Rejected || 0}
          subtitle="part of the process"
          color="red"
        />
      </div>

      {/* chart + recent jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* donut chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Application Breakdown
          </h3>
          {chartData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              No data yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* recent jobs — spans 2 columns */}
        <div className="lg:col-span-2">
          <RecentJobs jobs={jobs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;