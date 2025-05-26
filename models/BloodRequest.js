import mongoose from "mongoose";
const { Schema } = mongoose;

const BloodRequestSchema = new Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'requesterModel'
    },
    requesterModel: {
        type: String,
        required: true,
        enum: ['Person', 'Institution']
    },
    bloodType: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    medicalCondition: { type: String, required: true },
    urgency: { type: String, enum: ['low', 'medium', 'high'], require:true },
    amountRequiredML: { type: Number, required: true, min: 100 },
    deadline: { type: Date, required: true },
    description: { type: String },
    status: { type: String, enum: ['open', 'fulfilled', 'cancelled'], default: 'open' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('BloodRequest', BloodRequestSchema);