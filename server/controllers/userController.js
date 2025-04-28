import User from "../models/User.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "Không tìm thấy người dùng" });
    }
    req.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
