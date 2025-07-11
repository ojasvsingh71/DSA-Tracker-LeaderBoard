import express from "express"
import { login, register, getGroupsByAdmin, getAdmin } from "../controllers/admin.control.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:id/groups", isAdmin, getGroupsByAdmin);
router.get("/getadmin", isAdmin, getAdmin);

export default router;