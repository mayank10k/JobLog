import StatusBadge from "../StatusBadge";
import { formatDate } from "../../utils/formatDate";

const RecentJobs = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Recent Applications
        </h3>
        <p className="text-sm text-gray-400 text-center py-6">
          No applications yet. Add your first job!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Recent Applications
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              <th className="pb-2 font-medium">Company</th>
              <th className="pb-2 font-medium">Role</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Applied</th>
            </tr>
          </thead>
          <tbody>
            {jobs.slice(0, 5).map((job) => (
              <tr
                key={job._id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 font-medium text-gray-800">
                  {job.company}
                </td>
                <td className="py-3 text-gray-500">{job.role}</td>
                <td className="py-3">
                  <StatusBadge status={job.status} />
                </td>
                <td className="py-3 text-gray-400">
                  {formatDate(job.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentJobs;