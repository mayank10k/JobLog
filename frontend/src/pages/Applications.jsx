import { useState, useEffect } from "react";
import { getAllJobs } from "../services/jobService";
import JobTable from "../components/JobTable";
import AddJobModal from "../components/AddJobModal";
import Button from "../components/ui/Button";
import { JOB_STATUSES } from "../utils/constants";

const Applications = () => {
  const [jobs, setJobs]         = useState([]);
  const [filter, setFilter]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getAllJobs(filter);
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobAdded = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs((prev) =>
      prev.map((j) => (j._id === updatedJob._id ? updatedJob : j))
    );
  };

  const handleJobDeleted = (deletedId) => {
    setJobs((prev) => prev.filter((j) => j._id !== deletedId));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            All Applications
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {jobs.length} application{jobs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          + Add Application
        </Button>
      </div>

      {/* filter buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter === ""
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {JOB_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* table */}
      {loading ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          Loading applications...
        </div>
      ) : (
        <JobTable
          jobs={jobs}
          onJobUpdated={handleJobUpdated}
          onJobDeleted={handleJobDeleted}
        />
      )}

      {/* modal */}
      <AddJobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onJobAdded={handleJobAdded}
      />
    </div>
  );
};

export default Applications;