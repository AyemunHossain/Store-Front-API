import { CarHeadLights } from './../interfaces/carHeadLights.interface';
import { CarBodyType } from '../interfaces/carBodyType.interface';
import { model,models,Schema } from 'mongoose';



const schema = new Schema <CarHeadLights>(
    {   

    front_lighting_type: {
        type: String,
        required: true
      },
      adjustable_headlights: {
        type: String,
        required: false
      },
      adjustableHeadlights: {
        type: String,
        required: false
      },
    },
    {
        timestamps: true
    }
)


const carsapp_carheadlights = models.carsapp_carheadlights || model<CarHeadLights>('carsapp_carheadlights', schema);
export default carsapp_carheadlights;