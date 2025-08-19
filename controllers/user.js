import bcrypt from 'bcrypt'
import { createCookie } from '../utils/cookie.js'
import User from '../models/user.js'
import {redis} from '../index.js'
import cookieParser from 'cookie-parser'

export const getBalance = async(req,res,next)=>{
    try{
        const userid = req.userid
        let balance = await redis.get(`UserBalance:${userid}:balance`)
        if(!balance){
            console.log('from DB')
            const user = await User.findById(userid)
            balance = user.balance
            await redis.set(`UserBalance:${userid}:balance`,balance)
        }
        res.status(200).json({
            success:true,
            balance
        })
    }
    catch(e){
        next(e)
    }
}

export const generateNewPassword = async(req,res,next)=>{
    try{
        const {newpass,reppass} = req.body
        if(newpass!=reppass)return res.status(400).json({
            success:false,
            message:"Password not matching in both fields"
        })
        
        const userid = req.userid

        let user = await User.findById(userid).select('+password')

        if(!user)return res.status(404).json({
            success:false,
            message:'Please enter correct login id'
        })

        const isSame = await bcrypt.compare(newpass,user.password)

        if(isSame) return res.status(400).json({
            success:false,
            message:'Password same as previous'
        })

        const hashedPassword = await bcrypt.hash(newpass,10)

        user.password = hashedPassword
        await user.save()

        await redis.del(`login:attempts:${loginId}`)

        res.status(200).json({
            success:true,
            message:"New password generated successfully"
        })

    }
    catch(e){
        next(e)
    }
}

export const loginUser = async(req,res,next)=>{
    try{
        const {loginId,password} = req.body
        
        const attemptsKey = `login:attempts:${loginId}`
        const attempts = await redis.incr(attemptsKey)

        if(attempts>3){
            return res.status(429).json({
                success:false,
                message:'Password is locked, generate new password to proceed'
            })
        }

        let user = await User.findOne({loginId}).select('+password').select('+isLocked')
        
        if(!user)return res.status(404).json({
            success:false,
            message:'Invalid login Id'
        })

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:'Wrogn password',
            })
        }

        await redis.del(attemptsKey)

        let balanceKey = `UserBalance:${user.id}:balance`
        const balance = await redis.set(balanceKey, user.balance)

        createCookie(user,res,"sessionCookie")
        return res.status(200).json({
            success:true,
            message:'Login Success'
        })
    }
    catch(e){
        next(e)
    }
}

export const signUpUser=async(req,res,next)=>{
    try{
        const {name,email,password,contact}=req.body
        let user = await User.findOne({contact})
        if(user)return res.status(404).json({
            success:false,
            message:'User already exists'
        })
        const hashedPassword = await bcrypt.hash(password,10)
        const loginId = Math.floor(10000000 + Math.random() * 90000000)
        const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000)
        user = await User.create({name,email,password:hashedPassword,contact,loginId,accountNumber})
        return res.status(201).json({
            success:true,
            message:'Success',
            loginId: `${loginId}`,
            accountNumber: `${accountNumber}`
        })
    }
    catch(e){
        next(e)
    }
}

export const logOut = async(req,res,next)=>{
    try{
        res.status(200).cookie("sessionCookie",null,{
            expires:new Date(Date.now())
        })
        return res.status(200).json({
            success:true,
            message:'Logout Success'
        })
    }
    catch(e){
        next(e)
    }
}
