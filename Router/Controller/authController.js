import User from "../../model/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { registerSchema, loginSchema } from "../../validation/authvalidation.js";

export const signup = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "User created"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email doesn't exist"
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err
        });
    }
}