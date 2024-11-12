import { authentication, random } from "../helpers";
import { createUser, getUserByEmail } from "../db/users";
import express from "express";
import Joi from "joi";
import { getCompany } from "../db/company";

export const register = async (req: express.Request, res: express.Response) : Promise<express.Response> => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.sendStatus(400);
            // return 1
        } 
        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return res.sendStatus(400);
        }
        const salt = random()
        const user = await createUser({
            email,
            firstName,
            lastName,
            authentication: {
                salt,
                password: authentication(salt, password)
            },
            role: 3
        })

        return res.status(201).json(user).end()
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}
const RecruiterSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    company: Joi.string().required()
})
export const registerRecruiter = async (req: express.Request, res: express.Response) : Promise<express.Response> => {
    try {
        const { error, value } = RecruiterSchema.validate(req.body);
        if (error) {
            return res.status(422).json({
              message: 'Validation error',
              details: error.details,
            });
        }

        const { firstName, lastName, email, password, company } = req.body;

        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return res.sendStatus(400);
        }
        const salt = random()
        const user = await createUser({
            email,
            firstName,
            lastName,
            authentication: {
                salt,
                password: authentication(salt, password)
            },
            role: 2,
            company
        })

        const companyModel = await getCompany(company);
        companyModel.users.push(company)
        await companyModel.save();

        return res.status(201).json(user).end()
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400)
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        const expectedHash = authentication(user.authentication.salt, password)
        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403)
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();
        res.cookie('CARE-MATCH', user.authentication.sessionToken, {domain: 'localhost', path: '/'})
        return res.status(200).json(user).end()
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}