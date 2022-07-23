import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarWheelSchema = new mongoose.Schema(
    {
    wheel_type: {
        type: String,
        required: false
      },
      rim_size: {
        type: String,
        required: false
      },
    },
    {
        timestamps: true
    }
)