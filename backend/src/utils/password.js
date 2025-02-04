import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

export const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, SALT_ROUNDS, 64, 'sha512').toString('hex');
    return { salt, hash };
};

export const verifyPassword = (password, salt, hash) => {
    const hashVerify = crypto.pbkdf2Sync(password, salt, SALT_ROUNDS, 64, 'sha512').toString('hex');
    return hash === hashVerify;
};