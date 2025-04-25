import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    // Kiểm tra biến môi trường
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      throw new Error("CLERK_WEBHOOK_SECRET is not defined");
    }

    // Kiểm tra headers
    const requiredHeaders = ["svix-id", "svix-timestamp", "svix-signature"];
    for (const header of requiredHeaders) {
      if (!req.headers[header]) {
        return res
          .status(400)
          .json({ success: false, message: `Missing ${header} header` });
      }
    }

    // Xác minh webhook
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        if (!data.email_addresses?.[0]?.email_address) {
          throw new Error("Missing email address in webhook data");
        }
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };
        await User.create(userData);
        return res.status(200).json({ success: true, message: "User created" });
      }

      case "user.updated": {
        if (!data.email_addresses?.[0]?.email_address) {
          throw new Error("Missing email address in webhook data");
        }
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };
        await User.findByIdAndUpdate(data.id, userData);
        return res.status(200).json({ success: true, message: "User updated" });
      }

      case "user.deleted": {
        if (!data.id) {
          throw new Error("Missing user ID in webhook data");
        }
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true, message: "User deleted" });
      }

      default:
        return res
          .status(400)
          .json({ success: false, message: "Unsupported webhook type" });
    }
  } catch (error) {
    if (error.message.includes("signature")) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid webhook signature" });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
};
