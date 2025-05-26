import mongoose from "mongoose";
const { Schema } = mongoose;

const AccountSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    }
});

export default mongoose.model('Account', AccountSchema);