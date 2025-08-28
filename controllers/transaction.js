import mongoose, { mongo } from "mongoose"
import Transaction from "../models/transaction.js"
import User from "../models/user.js"
import bcrypt from "bcrypt"

export const transferAmnt=async(req,res,next)=>{
    const {amount, entered_password, receiver_acc}=req.body

    const [currUser,receiverUser] = await Promise.all([
        User.findById(req.userid).select('+password'),
        User.findOne({accountNumber: receiver_acc})
    ])

    if(!receiverUser)return res.status(404).json({
        success:false,
        message: 'Receiver not found/ Enter correct account number'
    })
    
    const isMatch = await bcrypt.compare(entered_password, currUser.password)

    if(!isMatch)return res.status(400).json({
        success:false,
        message: 'Incorrect password'
    })
    
    if(currUser.balance<amount)return res.status(400).json({
        success:false,
        message: 'Insufficient balance'
    })

    const session = await mongoose.startSession()
    session.startTransaction()

    try {

        currUser.balance -= amount
        receiverUser.balance += amount

        await User.bulkWrite([
            {
                updateOne: {
                    filter: { _id: currUser._id },
                    update: { $set: { balance: currUser.balance } }
                }
            },
            {
                updateOne: {
                    filter: { _id: receiverUser._id },
                    update: { $set: { balance: receiverUser.balance } }
                }
            }
        ], { session })

        let txnid_curr = Math.floor(10000000 + Math.random() * 90000000)
        let txnid_rec = Math.floor(10000000 + Math.random() * 90000000)

        await Transaction.create([
            {
                userid: req.userid,
                txnid: txnid_curr,
                date: new Date(),
                receiver: receiverUser.accountNumber,
                debit: amount,
                remnBalance: currUser.balance
            },
            {
                userid: receiverUser.id,
                txnid: txnid_rec,
                date: new Date(),
                receiver: currUser.accountNumber,
                credit: amount,
                remnBalance: receiverUser.balance
            }
        ], { session, ordered: true })

        await session.commitTransaction()
    } catch (error) {
        await session.abortTransaction()
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Transaction failed'
        })
    } finally {
        session.endSession()
    }

    res.json({
        success: true,
        message: 'Amount transferred successfully',
        user:req.userid
    })
}