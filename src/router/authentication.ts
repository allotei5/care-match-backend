import express from 'express'
import { login, register, registerRecruiter } from '../controllers/authentication'
import { isAdmin, isAuthenticated } from '../middlewares'

export default (router: express.Router) => {
    router.post('/auth/register', register)
    router.post('/auth/login', login)
    router.post('/recruiter', isAuthenticated, isAdmin, registerRecruiter)
}