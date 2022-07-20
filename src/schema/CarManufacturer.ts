import { CarManufacturer } from './../interfaces/carManufacturer.interface';
import {model, models, Schema} from "mongoose";


const schema = new Schema <CarManufacturer>(
    {
          maker_name: {
            type: String,
            required: true,
          },
          maker_country: {
            type: String,
            required: false,
          },
          maker_logo: {
            type: String,
            required: false,
          },
          maker_logo_url: {
            type: String,
            required: false,
          },
          serial: {
            type: String,
            required: false,
          },
    },
    {
        timestamps: true
    }
)


const carsapp_carmanufacturers = models.carsapp_carmanufacturers || model<CarManufacturer>('carsapp_carmanufacturers', schema);
export default carsapp_carmanufacturers;
