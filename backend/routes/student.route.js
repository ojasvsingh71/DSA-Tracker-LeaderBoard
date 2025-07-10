import { addStudent, getstudents, deletestudent, syncStudent } from "../controllers/students.controller.js"
import express from "express"
import isAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/:id/add", isAdmin, addStudent);
router.get("/:id/get", getstudents);
router.post("/id/delete", isAdmin, deletestudent);
router.post("/:id/sync", syncStudent);

export default router;