import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const token = (req, res, next) => {
    const header = req.headers.authorization;

    try {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({
                success: false,
                message: "No header"
            });
        }

        const parts = header.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).send("Header is Invalid");
        }

        const authToken = parts[1];

        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        console.log(decoded)
        req.user = decoded.userId;

        next();

    } catch (err) {
        res.status(403).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

export default token;