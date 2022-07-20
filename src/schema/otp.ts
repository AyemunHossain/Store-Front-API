import { CarWheel } from './../interfaces/carWheel.interface';
import { model, models, Schema } from 'mongoose';
import { Otp } from '../interfaces/otp.interface';


const schema = new Schema<any>(
    {
        phoneNo: {
            type: String,
            required: true,
            unique: true,
        },
        code: {
            type: String,
            required: true,
        },
        expireTime: {
            type: String,
            required: false,
        },
        count: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
        timestamps: { createdAt: false, updatedAt: true },
    },
)


const otp = models.otp || model<CarWheel>('otp', schema);
export default otp;