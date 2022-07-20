import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarColorSchema = new mongoose.Schema(
{

    car_color: {
        type: String,
          required: true
      },
      serial: {
        type: String,
          required: false
      }
  },
  {
      timestamps: true
  })
