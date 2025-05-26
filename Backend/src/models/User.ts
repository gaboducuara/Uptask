import mongoose, {Schema, Document} from 'mongoose'

export interface IUser extends Document {
  email:String
  password:String
  name: String
  confirmed: String
}

const userSchema : Schema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  passowrd:{
    type:String,
    required: true
  },
  name:{
    type:String,
    required: true
  },
  confirmed:{
    type:Boolean,
    default: false
  },
})

const User = mongoose.model<IUser>('User', userSchema)
export default User;
