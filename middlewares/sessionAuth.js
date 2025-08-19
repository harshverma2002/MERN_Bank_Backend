import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

export const isAuthenticated=async(req,res,next)=>{
    const {sessionCookie} = req.cookies
    if(!sessionCookie)return res.status(404).json({
        success:false,
        message:'login first'
    })
    const decoded = jwt.verify(sessionCookie, process.env.JWT_SECRET)
    req.userid = decoded.id
    next()
}