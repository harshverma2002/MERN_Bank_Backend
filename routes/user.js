import express from 'express'
import { getBalance, logOut, signUpUser } from '../controllers/user.js'
import { loginUser ,generateNewPassword} from '../controllers/user.js'
import { isAuthenticated } from '../middlewares/sessionAuth.js'

const router = express.Router()
router.post('/signup', signUpUser)
router.post('/login', loginUser)
router.patch('/genPass', isAuthenticated,generateNewPassword)
router.get('/logout',logOut)
router.get('/balance', isAuthenticated, getBalance)

export default router

