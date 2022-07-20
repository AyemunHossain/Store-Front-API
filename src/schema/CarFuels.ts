import { model, models, Schema } from 'mongoose';
import { CarBodyType } from '../interfaces/carBodyType.interface';
import { CarFuel } from '../interfaces/carFuels.interface';



const schema = new Schema <CarFuel>(
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


const carsapp_carfueles = models.carsapp_carfueles || model<CarFuel>('carsapp_carfueles', schema);
export default carsapp_carfueles;