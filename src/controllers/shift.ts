import { createShift } from '../db/shift';
import express from 'express'
import Joi from 'joi'
import { get } from 'lodash';
import { ObjectId } from 'mongoose';

const shiftValidationSchema = Joi.object({
    shiftName: Joi.string().optional(),
    wage: Joi.number().optional(),
    location: Joi.string().optional(),
    date: Joi.date().optional(),
    startTime: Joi.date().optional(),
    endTime: Joi.date().optional(),
    jobDescription: Joi.string().optional(),
    status: Joi.string()
      .valid('active', 'inactive', 'pending')
      .optional(), // Only `status` is required
});

export const storeShift = async (req: express.Request, res:express.Response) => {
    try {
        const { error, value } = shiftValidationSchema.validate(req.body)
        if (error) {
            return res.status(422).json({
              message: 'Validation error',
              details: error.details,
            });
        }
        // complete the function
        const recruiterId  = get(req, 'identity._id') as string;
        // Add the recruiter ID to the validated shift data
        const shiftData = {
            ...value,
            recruiter: recruiterId,
            status: 'inactive'
        };
        const newShift = await createShift(shiftData);
        return res.status(201).json(newShift);
    } catch (error) {
        console.log(error)
        return res.sendStatus(400);
    }
}