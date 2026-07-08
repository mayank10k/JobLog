import API from "../api/axios";

export const getStats = async () => {
  const res = await API.get("/jobs/stats");
  return res.data;
};