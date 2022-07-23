import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarSuspensionsSchema = new mongoose.Schema(
  {

    rear_suspension_type: {
      type: String,
      required: false
    },
    front_suspension_type: {
      type: String,
      required: false
    },
  },
  {
    timestamps: true
  }
)
