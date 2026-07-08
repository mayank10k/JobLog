import { useState } from "react";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { addJob } from "../services/jobService";
import { JOB_STATUSES } from "../utils/constants";

const AddJobModal = ({ isOpen, onClose, onJobAdded }) => {
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "Applied",
    notes: "",
    reminderDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const newJob = await addJob(form);
      onJobAdded(newJob);
      setForm({
        company: "",
        role: "",
        status: "Applied",
        notes: "",
        reminderDate: "",
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Application">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Company"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Google"
          required
        />
        <Input
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Software Engineer Intern"
          required
        />

        {/* status dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {JOB_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* reminder date */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Follow-up reminder date
          </label>
          <input
            type="date"
            name="reminderDate"
            value={form.reminderDate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* notes */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any notes about this application..."
            rows={3}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Adding..." : "Add Job"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddJobModal;