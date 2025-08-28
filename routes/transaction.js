import express from 'express'
import { isAuthenticated } from '../middlewares/sessionAuth.js'
import { transferAmnt } from '../controllers/transaction.js'

const router = express.Router()

router.post('/transferToAccount', isAuthenticated, transferAmnt)

export default router