import { Schema, model,models } from 'mongoose';
import { CarSeats } from '../interfaces/carSeats.interface';



const schema = new Schema <CarSeats>(
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


const carsapp_carseats = models.carsapp_carseats || model<CarSeats>('carsapp_carseats', schema);
export default carsapp_carseats;
