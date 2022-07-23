import * as mongoose from 'mongoose';

export const StoreSchema = new mongoose.Schema(
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
    phoneNo: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    aboutUs: {
      type: String,
      required: false,
    }, 
    address: {
      type: String,
      required: false,
    }, 
    logo: {
      type: String,
    },
    backdrop: {
      type: String,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
