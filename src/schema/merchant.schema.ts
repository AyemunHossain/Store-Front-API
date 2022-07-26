import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const MerchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: false,
    },
    profileImg: {
      type: String,
    },
    joinDate: {
      type: String,
      required: true,
      default: Date.now
    },
    subscriptionPlan: {
        type: Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true,
    },

    subscriptionEndAt: {
      required: false,
      type: Date,
    },

    subscriptionStartedAt: {
      required: false,
      type: Date,
    },

    hasAccess: {
      type: Boolean,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
