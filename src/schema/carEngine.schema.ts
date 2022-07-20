import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarEngineSchema = new mongoose.Schema(
    {
        engine_type: {
            type: String,
            required: false
        },
        engine_number: {
            type: String,
            required: false
        },
        max_torque: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true
    }
)