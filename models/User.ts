import mongoose, {Schema, model, models} from "mongoose"
import bcryptjs from "bcryptjs"

export interface type_user{
    email : string,
    password : string,
    _id? : mongoose.Types.ObjectId,
    createdAt? : Date,
    updatedAt? : Date
}

const userSchema = new Schema<type_user>(
    {
    email : {  type : String , required : true, unique: true},
    password : {  type : String , required : true}
    },
    {
        timestamps: true
    }
)

// hooks are of 2 types pre and post, pre works before saving to DB and and post works after saving to the DB

userSchema.pre('save', async function(next) {
    if(this.isModified("password")){
            this.password = await bcryptjs.hash(this.password, 10)  
    }
    next()
}
)