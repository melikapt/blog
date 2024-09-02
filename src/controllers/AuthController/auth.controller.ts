import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { Users } from '../../entities/User.entity';
import { dataSource } from '../../data-source';
const userRepository = dataSource.getRepository('Users');
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { generateToken } from '../../helpers/generate-token';


export class AuthController {
    static async signUpUser(req: Request, res: Response) {
        try {
            const { first_name, last_name, username, email, password } = req.body;
            if (first_name === '' || last_name === '' || username === '' ||
                email === '' || password === '' || first_name === undefined ||
                last_name === undefined || username === undefined || email === undefined ||
                password === undefined) {
                return res.status(422).send('Field not allowed be empty');
            }

            const newUser = new Users()
            newUser.first_name = first_name;
            newUser.last_name = last_name;
            newUser.username = username;
            newUser.email = email;
            newUser.password = password;
            newUser.createdAt = new Date(Date.now());

            const error = await validate(newUser);
            if (error.length > 0) {
                return res.status(422).send(error[0].constraints);
            }

            const user = await userRepository.findOne({
                where: {
                    email: newUser.email
                }
            })
            if (user) return res.status(422).send('this user already exist');

            newUser.password = await hashPassword(newUser.password);
            await dataSource.createQueryBuilder()
                .insert()
                .into(Users)
                .values(newUser)
                .execute()

            const token = generateToken(newUser)

            res.status(200).json({ token, user: _.pick(newUser, ['first_name', 'last_name', 'username']) });
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (email === '' || email === undefined || password === '' || password === undefined) {
                return res.status(422).send('Field not allowed to be empty');
            }

            const user = await userRepository.findOne({
                where: {
                    email: email
                }
            })

            if (!user) return res.status(404).send('This user does not exist');

            const isValid = await verifyPassword(password, user.password);
            if (!isValid) return res.status(404).send('This user does not exist');

            const token = generateToken(user)
            return res.status(200).send({ token, user: _.pick(user, ['first_name', 'last_name', 'username']) })

        } catch (error) {
            res.status(500).send(error)
        }
    }
}



async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

async function verifyPassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

