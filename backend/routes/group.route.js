import express from "express"
import { addGroup, getGroup, editGroup, deleteGroup } from "../controllers/groups.controller.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/add", isAdmin, addGroup);
router.get("/:id/leaderboard", getGroup);
router.patch("/:id/edit", isAdmin, editGroup);
router.delete("/:id/delete", isAdmin, deleteGroup);

export default router;