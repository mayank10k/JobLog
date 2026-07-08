import API from "../api/axios"

export const getAllJobs = async (status = "") => {
  const url = status ? `/jobs?status=${status}` : "/jobs";
  const res = await API.get(url);
  return res.data;
};

export const addJob = async (jobData) => {
  const res = await API.post("/jobs", jobData);
  return res.data;
};

export const updateJob = async (id,updates) => {
  const res = await API.patch(`/jobs/${id}`, updates);
  return res.data;
};

export const deleteJob = async (id) => {
  const res = await API.delete(`/jobs/${id}`);
  return res.data;
};

export const getReminders = async () => {
  const res = await API.get("/jobs/reminders");
  return res.data;
};

//statsService
export const getStats = async () => {
  const res = await API.get("/jobs/stats");
  return res.data;
};