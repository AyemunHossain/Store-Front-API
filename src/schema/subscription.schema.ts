import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const SubscriptionSchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: false,
    },
    
    name: {
      type: String,
      required: true,
      trim: true,
    },

    days: {
      type: Number,
      required: false,
    },

    price: {
      type: Number,
      required: false,
    },

    postCount: {
        type: Number,
        required: false,
      },

    // endAt:{
    //   required: false,
    //   type: Date,
    // },

    // startedAt:{
    //   required: false,
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
