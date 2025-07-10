import { addStudent, getstudents, deletestudent, syncStudent } from "../controllers/students.controller.js"
import express from "express"

const router = express.Router();

router.post("/add", addStudent);
router.get("/get", getstudents);
router.post("/delete", deletestudent);
router.post("/:id/sync", syncStudent);

export default router;