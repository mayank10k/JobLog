const logout = async (req, res) => {
  try {
    const redisClient = require("../config/redis");

    // delete session from Redis using user id
    await redisClient.del(`session:${req.user.id}`);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};