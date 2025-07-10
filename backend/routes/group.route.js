import express from "express"
import { addGroup, getGroup } from "../controllers/groups.controller.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/add", isAdmin, addGroup);
router.get("/:id/leaderboard", getGroup);

export default router;