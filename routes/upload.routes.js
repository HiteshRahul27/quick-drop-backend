import express from "express";
import { generateUploadSignature, confirmUpload } from "../Controller/upload.controller.js";
import { downloadFile, getFiles, delFiles } from "../Controller/fileController.js";
import rate from "../middleware/rate.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signature", auth, generateUploadSignature);
router.post("/confirm", auth, confirmUpload);

router.get("/", auth, rate, getFiles);
router.get("/:id/download", auth, rate, downloadFile);
router.delete("/:id", auth, delFiles);

export default router;