// models/Session.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const SessionSchema = new Schema({
    account_id: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    expires_at: {
        type: Date,
        required: true
    },
    refresh_token: {
        type:String,
        required: true
    }
});

export default mongoose.model('Session', SessionSchema);
