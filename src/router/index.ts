import express from 'express'
import multer from 'multer';
import authentication from './authentication'
import company from './company';
import shift from './shift';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    company(router);
    shift(router);
    return router;
}