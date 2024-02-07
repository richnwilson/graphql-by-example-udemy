import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from './models/user.js';

import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});

const secret = Buffer.from(process.env.SECRET, 'base64');
export const authMiddleware = expressjwt({
    algorithms: ['HS256'],
    credentialsRequired: false,
    secret
});

export async function handleLogin(req, res)  {
    try {
        const  { email, password } = req.body;
        const user = await User.findOne({email}).lean().exec();
        if(!user) {
            return response.status(400).send({ message: "The user or password are incorrect" });
        }
        // In production should use something like bcyrpt to compare encrypted password, as
        //   should never store password in DB in text sting i.e.
        //   !bcrypt.compareSync(password, user.password)
        if (user.password !== password) {
            res.sendStatus(401);
        } else {
            const claims = { sub: user._id.toString() , email: user.email };
            const token = jwt.sign(claims, secret);
            res.json({token})
        }
    } catch(e) {
        res.status(500).send(e)
    }
}