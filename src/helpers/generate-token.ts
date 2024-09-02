import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

export function generateToken(payload: any) {
    try {
        const { first_name, last_name, username, email, createdAt, id } = payload;
        return jwt.sign({ first_name, last_name, username, email, createdAt, id }, SECRET_JWT_KEY as string);
    } catch (error) {
        console.log(error);
    }
}