import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarLocationSchema = new mongoose.Schema(
    {
        city_id: {
          type: String,
          required: false
        },
        serial: {
          type: String,
          required: false
        }
      },
      {
          timestamps: true
      }
)