import { storeShift, updateShiftFxn } from '../controllers/shift'
import express from 'express'
import { isAdmin, isAuthenticated, isRecruiter } from '../middlewares'

export default (router: express.Router) => {
    router.post("/shift", isAuthenticated, isAdmin, storeShift)
    router.put("/shift/:id", isAuthenticated, isRecruiter, updateShiftFxn)
}