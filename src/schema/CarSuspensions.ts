import { CarSuspensions } from './../interfaces/carSuspensions.interface';
import { CarBodyType } from '../interfaces/carBodyType.interface';
import {model, models, Schema} from 'mongoose';


const schema = new Schema <CarSuspensions>(
    {   

    rear_suspension_type: {
        type: String,
        required: false
      },
      front_suspension_type: {
        type: String,
        required: false
      },
    },
    {
        timestamps: true
    }
)


const carsapp_carsuspensions = models.carsapp_carsuspensions || model<CarSuspensions>('carsapp_carsuspensions', schema);
export default carsapp_carsuspensions;