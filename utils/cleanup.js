import File from "../model/cloudfile.js";
import { v2 as cloudinary } from "cloudinary";

async function cleanup() {
  try {
    const now = new Date();

    const threshold = new Date(now.getTime() - 10 * 60 * 1000);

    const expiredFiles = await File.find({
      status: "UPLOADING",
      createdAt: { $lt: threshold }
    });

    for (const file of expiredFiles) {
      try {
        if (file.public_id) {
          await cloudinary.uploader.destroy(file.public_id);
        }

        await File.deleteOne({ _id: file._id });

        console.log(`Deleted stale upload: ${file._id}`);
      } catch (err) {
        console.error("Error deleting file:", file._id, err);
      }
    }

    console.log(`Cleanup completed. Checked ${expiredFiles.length} files.`);
  } catch (err) {
    console.error("Cleanup job failed:", err);
  }
}

export default cleanup;