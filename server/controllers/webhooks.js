import { Webhook } from "svix";
import User from "../models/User";

// API Controller Function to Manage Clerk User with database

export const clerkWebhooks = async (requestAnimationFrame, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(requestAnimationFrame.body), {
      "svix-id": requestAnimationFrame.headers["svix-id"],
      "svix-timestamp": requestAnimationFrame.headers["svix-timestamp"],
      "svix-signature": requestAnimationFrame.headers["svix-signature"],
    });

    const { data, type } = req.body;
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_address[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_address[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.delete": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
