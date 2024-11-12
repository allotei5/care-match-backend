import { createCompany } from '../db/company';
import express from 'express'
import Joi from 'joi';

const CompanySchema = Joi.object({
    companyName: Joi.string().required()
})

export const storeCompany = async (req: express.Request, res:express.Response) => {
    try {
        const { error, value } = CompanySchema.validate(req.body);
        if (error) {
            return res.status(422).json({
              message: 'Validation error',
              details: error.details,
            });
        }

        const { companyName } = value;
        const company = await createCompany({
            companyName,
            logo: req.file?.path
        })

        return res.status(201).json(company).end()
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}