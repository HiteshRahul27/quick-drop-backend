import crypto from "crypto";
import File from "../model/cloudfile.js";

export const generateUploadSignature = async (req, res) => {
    try {
        const fileId = crypto.randomUUID();

        await File.create({
            fileId,
            userId: req.user,
            status: "UPLOADING"
        });

        const timestamp = Math.floor(Date.now() / 1000);

        const stringToSign = `timestamp=${timestamp}`;

        const signature = crypto
            .createHash("sha1")
            .update(stringToSign + process.env.API_SECRET)
            .digest("hex");

        return res.json({
            fileId,
            timestamp,
            signature,
            apiKey: process.env.API_KEY,
            cloudName: process.env.CLOUD_NAME
        });

    } catch (err) {
        console.error("INIT ERROR:", err);
        return res.status(500).json({ error: err.message });
    }
};

export const confirmUpload = async (req, res) => {
    try {
        const { fileId, public_id, secure_url, size } = req.body;

        const record = await File.findOne({ fileId });

        if (!record) {
            return res.status(404).json({ error: "Invalid fileId" });
        }

        if (record.status !== "UPLOADING") {
            return res.status(400).json({ error: "Already completed or invalid state" });
        }

        record.status = "COMPLETED";
        record.public_id = public_id;
        record.secure_url = secure_url;
        record.size = size;

        await record.save();

        return res.json({
            message: "Upload confirmed",
            data: record
        });

    } catch (err) {
        console.error("CONFIRM ERROR:", err);
        return res.status(500).json({ error: err.message });
    }
};