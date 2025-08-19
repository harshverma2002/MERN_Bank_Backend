import mongoose from "mongoose";

mongoose.schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true,
        select:false,
        validate:{
            validator: v=>v.length>=6,
            message:'Password must be 6 characters long'
        }
    },
    contact:{
        type:String,
        unique:true,
        validate:{
            validator: v=>v.length===10,
            message:'Phone number must be 10 characters long'
        }
    },
    loginId:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator: v=>v.length===8,
            message:'Login Id must be 8 characters long'
        }
    },
    balance:{
        type:Number,
        default:0
    },
    accountNumber:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator: v=>v.length===10,
            message:'Account number must be 10 characters long'
        }
    },
    isLocked:{
        type:Boolean,
        default:false
    }
})

export default mongoose.model('User', mongoose.schema)