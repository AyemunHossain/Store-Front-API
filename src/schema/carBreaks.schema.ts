import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarBreaksSchema = new mongoose.Schema(
    {
        rear_break_type: {
          type: String,
          required: true
        },
        front_break_type: {
          type: String,
          required: true
        },
      },
      {
          timestamps: true
      }
)
