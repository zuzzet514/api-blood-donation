import mongoose from "mongoose";
const { Schema } = mongoose;

const DonorInfoSchema = new Schema({
    last_surgery_date: { type: Date, required: true },
    last_tattoo_or_piercing_date: { type: Date, required: true },
    has_heart_disease: { type: Boolean, required: true },
    is_pregnant: { type: Boolean, required: true },
    has_disqualifying_conditions: { type: Boolean, required: true },
    is_eligible: { type: Boolean, default: false }
}, { _id: false });


const PersonSchema = new Schema({
    account_id: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        enum: ["F", "M"],
        required: true
    },
    address: {
        street: { type: String, required: true },
        city:   { type: String, required: true },
        state:  { type: String, required: true },
        zip_code: { type: String, required: true },
        country: { type: String, required: true }
    },
    phone: {
        type: String,
        required: true
    },
    blood_type: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        required: true
    },
    donor_info: {
        type: DonorInfoSchema,
        required: false
    }
});

export default mongoose.model('Person', PersonSchema);