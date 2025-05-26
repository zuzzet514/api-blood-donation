import jwt from "jsonwebtoken";

const errorOrigin= "[From authMiddleware]"

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) return res.status(401).json({ error: `${errorOrigin} Access token required` });

    const token = authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: `${errorOrigin} Malformed authorization header` });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: `${errorOrigin} Invalid or expired token` });
    }
}

export default authMiddleware;
