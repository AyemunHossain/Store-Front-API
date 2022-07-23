import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const PromotionSchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: false,
    },
    headline: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin'
    },
    startAt: {
      type: String,
      required: false,
    },
    endAt: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
