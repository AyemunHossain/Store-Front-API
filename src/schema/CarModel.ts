import { CarModel } from '../interfaces/carModel.interface';
import { CarBodyType } from '../interfaces/carBodyType.interface';
import { model, models, Schema } from 'mongoose';


const schema = new Schema<CarModel>(
    {
        model_name: {
            type: String,
            required: true
        },
        release_year: {
            type: String,
            required: true
        },
        maker_id: {
            type: String,
            required: true
        },
        serial: {
            type: String,
            required: true
        },
        makerId: {
            type: Schema.Types.ObjectId,
            ref: 'carsapp_carmanufacturers',
            required: false
        },
        modelId: {
            type: Schema.Types.ObjectId,
            ref: 'carsapp_carmodels',
            required: false
        }
    },
    {
        timestamps: true
    }
)


const carsapp_carmodels = models.carsapp_carmodels || model<CarModel>('carsapp_carmodels', schema);
export default carsapp_carmodels;