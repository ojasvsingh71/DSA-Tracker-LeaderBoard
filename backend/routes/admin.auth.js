import express from "express"
import { login, register } from "../controllers/admin.control.js";

const router = express.Router();

router.post("/auth/admin/register", register);
router.post("/auth/admin/login", login);

export default router;