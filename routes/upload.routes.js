import express from "express";
import { generateUploadSignature, confirmUpload } from "../controller/upload.controller.js";
import { downloadFile, getFiles, delFiles } from "../controller/fileController.js";
import rate from "../middleware/rate.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signature", auth, generateUploadSignature);
router.post("/confirm", auth, confirmUpload);

router.get("/", auth, rate, getFiles);
router.get("/:id/download", auth, rate, downloadFile);
router.delete("/:id", auth, delFiles);

export default router;