import {registerAccount, loginAccount, logoutAccount} from '../services/authService.js';
import {generateAccesToken, generateRefreshToken, parseExpiration, verifyToken} from '../utils/auth/jwtUtils.js'

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Session from "../models/Session.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const errorOrigin = "[From authController]"

export const register = async (req, res) => {
    try {
        const result = await registerAccount(req.body);
        res.status(201).json({ message: "Account registered successfully", ...result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const result = await loginAccount(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const accountId = req.user.id;
        if (!accountId) {
            return res.status(401).json({ error: `${errorOrigin} Unauthorized: no account ID found in token` });
        }

        const result = await logoutAccount(accountId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getNewAccessToken = async (req, res) => {
    const { refresh_token } = req.body

    if (!refresh_token) return res.status(400).json({ error: `${errorOrigin} No refresh token provided` });

    try {
        const decoded = verifyToken(refresh_token, process.env.JWT_REFRESH_SECRET)

        const session = await Session.findOne({ account_id: decoded.id, refresh_token });

        if (!session) throw new Error(`${errorOrigin} couldn't find any session`);

        const payload = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email
        };

        const newAcccessToken = generateAccesToken(payload);

        return res.status(200).json({ access_token: newAcccessToken });

    } catch (error) {
        return res.status(403).json({ error: 'Invalid refresh token' });
    }
};
