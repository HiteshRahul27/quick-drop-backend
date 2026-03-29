import { v2 as cloudinary } from "cloudinary";
import File from "../../model/cloudfile.js";

export const downloadFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        if (file.userId.toString() !== req.user) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        if (file.status !== "COMPLETED") {
            return res.status(400).json({
                success: false,
                message: "File not ready",
            });
        }

        return res.json({
            success: true,
            url: file.secure_url,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const getFiles = async (req, res) => {
    try {
        const files = await File.find({ userId: req.user });

        res.json({
            success: true,
            data: files,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const delFiles = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        if (file.userId.toString() !== req.user) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        if (file.public_id) {
            await cloudinary.uploader.destroy(file.public_id);
        }

        await File.findByIdAndDelete(file._id);

        res.json({
            success: true,
            message: "File deleted",
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};