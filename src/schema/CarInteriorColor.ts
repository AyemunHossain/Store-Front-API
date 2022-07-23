import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarInteriorColorSchema = new mongoose.Schema({
    int_color: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: false
    },
    updatedAt: {
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
  })