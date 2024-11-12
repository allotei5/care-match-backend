import { storeShift } from '../controllers/shift'
import express from 'express'
import { isAdmin, isAuthenticated } from '../middlewares'

export default (router: express.Router) => {
    router.post("/shift", isAuthenticated, isAdmin, storeShift)
}