import mongoose from "mongoose";
const { Schema } = mongoose;

const InstitutionSchema = new Schema({
    account_id: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    name: {
        type: String,
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
    fax: {
        type: String
    },
    website: {
        type: String
    }
});

export default mongoose.model('Institution', InstitutionSchema);