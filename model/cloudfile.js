import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["UPLOADING", "COMPLETED"],
    default: "UPLOADING",
  },
  public_id: String,
  secure_url: String,
  size: Number,
}, { timestamps: true });

fileSchema.index({ status: 1, createdAt: 1 });

delete mongoose.models.File;

export default mongoose.model("File", fileSchema);