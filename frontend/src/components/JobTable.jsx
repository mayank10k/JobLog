import { useState } from "react";
import StatusBadge from "./StatusBadge";
import Button from "./ui/Button";
import { updateJob, deleteJob } from "../services/jobService";
import { JOB_STATUSES } from "../utils/constants";
import { formatDate } from "../utils/formatDate";

const JobTable = ({ jobs, onJobUpdated, onJobDeleted }) => {
  const [editingId, setEditingId]     = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await updateJob(id, { status: newStatus });
      onJobUpdated(updated);
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ← this replaces handleDelete completely
  const handleDeleteConfirm = async () => {
    try {
      await deleteJob(deletingJob._id);
      onJobDeleted(deletingJob._id);
      setDeletingJob(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
        <p className="text-gray-400 text-sm">No applications found.</p>
        <p className="text-gray-300 text-xs mt-1">
          Click "Add Application" to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs text-gray-500">
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Applied</th>
                <th className="px-4 py-3 font-medium">Reminder</th>
                <th className="px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {job.company}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{job.role}</td>
                  <td className="px-4 py-3">
                    {editingId === job._id ? (
                      <select
                        defaultValue={job.status}
                        onChange={(e) =>
                          handleStatusChange(job._id, e.target.value)
                        }
                        onBlur={() => setEditingId(null)}
                        autoFocus
                        className="border border-gray-300 rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        {JOB_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <div
                        onClick={() => setEditingId(job._id)}
                        className="cursor-pointer"
                        title="Click to update status"
                      >
                        <StatusBadge status={job.status} />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {formatDate(job.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {job.followUpDue ? (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                        Follow up!
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">
                        {formatDate(job.reminderDate)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate">
                    {job.notes || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="danger"
                      onClick={() => setDeletingJob(job)} // ← passes full job object
                      className="text-xs px-3 py-1"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* custom delete confirmation modal */}
      {deletingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/10"
            onClick={() => setDeletingJob(null)}
            />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 z-10 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Delete this application?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. This will permanently delete the
              application for{" "}
              <span className="font-semibold text-red-500">
                {deletingJob.company} — {deletingJob.role}
              </span>
              .
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingJob(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobTable;