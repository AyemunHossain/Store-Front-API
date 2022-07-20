import { CarBreaks } from '../interfaces/carBreaks.interface';
import { model, models, Schema } from 'mongoose';
import { CarLocation } from '../interfaces/carLocations.interface';

const schema = new Schema <CarLocation>(
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

const carsapp_carlocations = models.carsapp_carlocations || model<CarLocation>('carsapp_carlocations', schema);
export default carsapp_carlocations;