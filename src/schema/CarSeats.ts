import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarSeatsSchema = new mongoose.Schema(
  {
    ventilated_seats: {
        type: String,
        required: false
      },
      ventilatedSeats: {
        type: Boolean,
        required: true
      },
      seat_type: {
        type: String,
        required: true
      },
    },
    {
        timestamps: true
    }
)