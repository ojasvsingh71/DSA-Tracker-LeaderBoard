import adminModel from "../models/admin.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await adminModel.findOne({ email });
        if (existing) {
            return res.status(400).json({
                message: "Email already in use!!!"
            })
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const admin = await adminModel.create({
            name: name,
            email: email,
            password: hashedPass
        })

        res.status(200).json({
            message: "Registed!!!",
            admin: {
                name: admin.name,
                email: admin.email
            }
        })
    } catch (err) {
        res.status(500).json({
            message: "Server error!!!",
            error: err
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await adminModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Admin not found"
            })
        }

        const isPassMatch = await bcrypt.compare(password, user.password);

        if (!isPassMatch) {
            return res.status(404).json({
                message: "Password Incorrect!!!"
            })
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );

        res.status(200).json({
            message: "User found!!!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        res.status(500).json({
            message: "Server error!!!",
            error: err
        })
    }
}

export { login, register };