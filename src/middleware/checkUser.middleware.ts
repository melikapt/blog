import { Request, Response, NextFunction } from "express";
import { dataSource } from "../data-source";
const userRepository = dataSource.getRepository('Users');



export async function checkUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await userRepository.findOne({
            where: {
                id: req.user.id
            }
        })
        if (!user) return res.status(404).send('You are not a registered user!')
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}