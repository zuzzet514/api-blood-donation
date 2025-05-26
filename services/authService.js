import Account from '../models/Account.js';
import Person from '../models/Person.js';
import Institution from '../models/Institution.js';
import Session from '../models/Session.js';
import bcrypt from 'bcryptjs';
import { generateAccesToken, generateRefreshToken, parseExpiration } from '../utils/auth/jwtUtils.js'

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const errorOrigin = "[From authService]"

export const registerAccount = async (data) => {
    const { username, email, password, type, personData, institutionData } = data;

    const existing = await Account.findOne({ email });
    if (existing) throw new Error(`${errorOrigin} Email already in use`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const account = await Account.create({ username, email, password: hashedPassword });

    if (type === 'person') {
        if (!personData) throw new Error(`\`${errorOrigin} Missing person data`);
        await Person.create({
            ...personData,
            account_id: account._id
            // donor_info will be left undefined
        });
    } else if (type === 'institution') {
        if (!institutionData) throw new Error(`\`${errorOrigin} Missing institution data`);
        await Institution.create({
            ...institutionData,
            account_id: account._id
        });
    } else {
        throw new Error(`\`${errorOrigin} Invalid registration type`);
    }

    return { message: "Account and profile created successfully" };
};

export const loginAccount = async ({ identifier, password }) => {

    const account = await Account.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    });

    if (!account) {
        throw new Error(`${errorOrigin} Account not found`);
    }

    const isPasswordCorrect = await bcrypt.compare(password, account.password);
    if (!isPasswordCorrect) {
        throw new Error(`${errorOrigin} Incorrect password`);
    }

    await Session.deleteMany({ account_id: account._id });

    const payload = {
        id: account._id,
        username: account.username,
        email: account.email
    };

    const access_token = generateAccesToken(payload);
    const refresh_token = generateRefreshToken(payload);

    const session = await Session.create({
        account_id: account._id,
        refresh_token,
        expires_at: new Date(
            Date.now() + parseExpiration(process.env.JWT_REFRESH_EXPIRES_IN)
        )
    });

    return {
        message: "Login successful",
        sessionId: session._id,
        account: {
            id: account._id,
            username: account.username,
            email: account.email
        },
        access_token,
        refresh_token
    };
};

export const logoutAccount = async (accountId) => {
    const session = await Session.findOneAndDelete({ account_id: accountId });
    if (!session) throw new Error(`${errorOrigin} Logout Session not found`);
    return { message: 'Logout successful' };
};


