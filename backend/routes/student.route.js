import { addStudent, getstudent, deletestudent, syncStudent, editstudent } from "../controllers/students.controller.js"
import express from "express"
import isAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/:id/add", isAdmin, addStudent);
router.get("/:id/get", isAdmin, getstudent);
router.delete("/:id/delete", isAdmin, deletestudent);
router.post("/:id/sync",isAdmin, syncStudent);
router.patch("/:id/edit", isAdmin, editstudent);

export default router;