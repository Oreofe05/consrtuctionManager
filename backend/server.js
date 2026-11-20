import dotenv from "dotenv";
import dns from "node:dns";


dotenv.config();

// Use Google's DNS to resolve MongoDB Atlas addresses
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

try {
  await connectDB();
  app.listen(PORT, () => console.log(`BuildControl API running on port ${PORT}`));
} catch (error) {
  console.error("Unable to start server:", error.message);
  process.exit(1);
}
