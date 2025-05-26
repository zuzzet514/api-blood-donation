import jwt from 'jsonwebtoken';

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const errorOrigin = "[From jwtUtils]"

export const generateAccesToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
    });
}

export const verifyToken = (token, secret= process.env.JWT_SECRET) => {
    return jwt.verify(token, secret);
}

export function parseExpiration(timeStr) {
    const unit = timeStr.slice(-1);
    const value = parseInt(timeStr.slice(0,-1));

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: throw new Error('Invalid expiration format');
    }
}