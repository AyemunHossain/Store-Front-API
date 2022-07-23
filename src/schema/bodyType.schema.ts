import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const BodyTypeSchema = new mongoose.Schema(
    {   
    body_name: {
        type: String,
        required: true
    },
    body_image: {
        type: String,
        required: false
    },
    body_image_url: {
        type: String,
        required: false
    },
    serial: {
        type: String,
        required: true
    }
    },
    {
        timestamps: true
    }
)