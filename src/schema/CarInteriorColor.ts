import { model, models, Schema } from "mongoose";
import { CarInteriorColor } from "../interfaces/carInteriorColor.interface";


const schema = new Schema<CarInteriorColor>({

    int_color: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: false
    },
    updatedAt: {
      type: String,
      required: false
    },
    serial: {
      type: String,
      required: true
    }
  },
  {
      timestamps: true
  })


const carsapp_interiorcolors = models.carsapp_interiorcolors || model<CarInteriorColor>('carsapp_interiorcolors', schema);
export default carsapp_interiorcolors;
