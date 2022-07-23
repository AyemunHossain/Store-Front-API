import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const ManufacturerSchema = new mongoose.Schema(
    {
          maker_name: {
            type: String,
            required: true,
          },
          maker_country: {
            type: String,
            required: false,
          },
          maker_logo: {
            type: String,
            required: false,
          },
          maker_logo_url: {
            type: String,
            required: false,
          },
          serial: {
            type: String,
            required: false,
          },
    },
    {
        timestamps: true
    }
)
