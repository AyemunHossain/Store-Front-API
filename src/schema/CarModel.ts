import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarModelSchema = new mongoose.Schema(
    {
        model_name: {
            type: String,
            required: true
        },
        release_year: {
            type: String,
            required: true
        },
        maker_id: {
            type: String,
            required: true
        },
        serial: {
            type: String,
            required: true
        },
        makerId: {
            type: Schema.Types.ObjectId,
            ref: 'carsapp_carmanufacturers',
            required: false
        },
        modelId: {
            type: Schema.Types.ObjectId,
            ref: 'carsapp_carmodels',
            required: false
        }
    },
    {
        timestamps: true
    }
)