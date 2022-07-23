import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarHeadLightsSchema = new mongoose.Schema(
    {   

    front_lighting_type: {
        type: String,
        required: true
      },
      adjustable_headlights: {
        type: String,
        required: false
      },
      adjustableHeadlights: {
        type: String,
        required: false
      },
    },
    {
        timestamps: true
    }
)