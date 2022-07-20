import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarBackLightSchema = new mongoose.Schema(
    {
      back_lighting_type: {
        type: String,
        required: true
      },
      adjustable_backlight: {
        type: String,
        required: true
      },
      adjustableBacklight: {
        type: Boolean,
        required: true
      },
    },
    {
        timestamps: true
    }
)