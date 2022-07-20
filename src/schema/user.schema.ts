import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const UserSchema = new mongoose.Schema(
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
    },
    userType: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'UserType',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    designation: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Designation',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    technologies: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Technology',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    hasAccess: {
      type: Boolean,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
