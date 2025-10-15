import express from "express";

import authenticateToken from "../middleware/isAuthenticated.js";
import {
  
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  stopJobController,
  updateJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(authenticateToken, postJob);
router.route("/get").get(authenticateToken, getAllJobs);
router.route("/getadminjobs").get(authenticateToken, getAdminJobs);
router.route("/update/:id").put(authenticateToken,updateJob)
router.route("/get/:id").get(authenticateToken, getJobById);
router.put("/stop/:jobId", authenticateToken, stopJobController);
export default router;
