import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarTypeSchema = new mongoose.Schema(
  {
  car_type: {
    type: String,
    required: true
  },
},
  {
    timestamps: true
  })