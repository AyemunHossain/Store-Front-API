import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarFuelSchema = new mongoose.Schema(
    {   
    fuel_type: {
        type: String,
        required: true
      },
      fuel_tank_capacity: {
        type: String,
        required: true
      }
    },
    {
        timestamps: true
    }
)