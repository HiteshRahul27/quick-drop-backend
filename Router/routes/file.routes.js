import express from "express";
import { delFiles, downloadFile, getFiles } from "../Controller/fileController.js";
import rate from "../../middleware/rate.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.get("/", auth, rate, getFiles);

router.get("/:id/download", auth, rate, downloadFile);

router.delete("/:id", auth, delFiles);

export default router;