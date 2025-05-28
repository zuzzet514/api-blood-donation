import mongoose from 'mongoose';
const { Schema } = mongoose;

const ApplicationSchema = new Schema({
    request_id: {
        type: Schema.Types.ObjectId,
        ref: 'BloodRequest',
        required: true,
        unique: true
    },
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: 'Person'
    }]
});

export default mongoose.model('Application', ApplicationSchema);
