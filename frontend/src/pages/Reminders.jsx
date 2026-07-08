import { useState, useEffect } from "react";
import { getReminders } from "../services/jobService";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils/formatDate";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await getReminders();
        setReminders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Reminders</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Jobs that need a follow-up
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          Loading reminders...
        </div>
      ) : reminders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
          <p className="text-gray-400 text-sm">No follow-ups due right now.</p>
          <p className="text-gray-300 text-xs mt-1">
            You're all caught up!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reminders.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl border border-amber-200 shadow-sm p-5 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800">{job.company}</p>
                <p className="text-sm text-gray-500 mt-0.5">{job.role}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Applied: {formatDate(job.createdAt)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={job.status} />
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  Follow up due
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reminders;