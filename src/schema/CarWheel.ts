import { CarWheel } from './../interfaces/carWheel.interface';
import { CarBodyType } from '../interfaces/carBodyType.interface';
import {model, models, Schema} from 'mongoose';


const schema = new Schema <CarWheel>(
    {
    wheel_type: {
        type: String,
        required: false
      },
      rim_size: {
        type: String,
        required: false
      },
    },
    {
        timestamps: true
    }
)


const carsapp_carwheels = models.carsapp_carwheels || model<CarWheel>('carsapp_carwheels', schema);
export default carsapp_carwheels;