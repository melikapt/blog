import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY

export function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header('auth-token');

        if (!token) return res.status(401).send('Unauthorized!');

        const decode = jwt.verify(token, SECRET_JWT_KEY as string);
        if (!decode) return res.status(401).send('Unauthorized');

        req.user = decode;

        next();

    } catch (error) {
        return res.status(500).send(error);
    }
}