import { CarType } from './../interfaces/carType.interface';
import { CarBodyType } from './../interfaces/carBodyType.interface';
import { models, model, Schema } from 'mongoose';


const schema = new Schema<CarType>({
  car_type: {
    type: String,
    required: true
  },
},
  {
    timestamps: true
  })


const carsapp_cartypes = models.carsapp_cartypes || model<CarType>("carsapp_cartypes", schema)
export default carsapp_cartypes;