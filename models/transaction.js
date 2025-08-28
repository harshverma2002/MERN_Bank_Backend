import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    txnid:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    receiver:{
        type: String,
        required: true
    },
    debit:{
        default: 0,
        type: Number,
    },
    credit:{
        default: 0,
        type: Number,
    },
    remnBalance:{
        type: Number,
        required: true
    }
})

export default mongoose.model("Transaction", transactionSchema);