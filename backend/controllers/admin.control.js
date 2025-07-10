import adminModel from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await adminModel.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email already in use!" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const admin = await adminModel.create({
            name,
            email,
            password: hashedPass
        });

        res.status(201).json({
            message: "Admin registered successfully!",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error while registering admin!",
            error: err.message || err
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await adminModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Admin not found!" });
        }

        const isPassMatch = await bcrypt.compare(password, user.password);
        if (!isPassMatch) {
            return res.status(401).json({ message: "Incorrect password!" });
        }

        const token = jwt.sign(
            { adminId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                adminId: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Server error during login!",
            error: err.message || err
        });
    }
};

export { login, register };