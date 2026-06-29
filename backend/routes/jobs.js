const express = require("express");
const router = express.Router();
const {jwtAuthMiddleware,generateToken} = require("../middleware/authMiddleware");
const {
  addJob,
  getAllJobs,
  updateJob,
  deleteJob,
  getStats,
  getReminders,
} = require("../controllers/jobController");

// all routes are protected — user must be logged in
router.get("/reminders", jwtAuthMiddleware, getReminders);  // ← must be BEFORE /:id
router.get("/stats", jwtAuthMiddleware, getStats);          // ← must be BEFORE /:id
router.get("/", jwtAuthMiddleware, getAllJobs);
router.post("/", jwtAuthMiddleware, addJob);
router.patch("/:id", jwtAuthMiddleware, updateJob);
router.delete("/:id", jwtAuthMiddleware, deleteJob);

module.exports = router;