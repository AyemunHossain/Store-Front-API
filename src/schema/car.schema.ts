import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarSchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: false,
    },
    carName: {
      type: String,
      required: false
    },
    mileage: {
      type: String,
      required: false
    },
    topSpeed: {
      type: String,
      required: false
    },
    maxPower: {
      type: String,
      required: false
    },
    acceleration: {
      type: String,
      required: false
    },
    width: {
      type: String,
      required: false
    },
    height: {
      type: String,
      required: false
    },
    numOfDoors: {
      type: String,
      required: false
    },
    featured: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    noOfViews: {
      type: String,
      required: false
    },
    noOfGear: {
      type: String,
      required: false
    },
    transmissionType: {
      type: String,
      required: false
    },
    carStatus: {
      type: String,
      required: false
    },
    chassisNo: {
      type: String,
      required: false
    },
    engineNo: {
      type: String,
      required: false
    },
    grade: {
      type: String,
      required: false
    },
    sellOption: {
      type: String,
      required: false
    },
    soldPrice: {
      type: String,
      required: false
    },
    drive: {
      type: String,
      required: false
    },
    registrationYear: {
      type: String,
      required: false
    },
    expiredOn: {
      type: String,
      required: false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel'
    },
    exteriorColor: {
      type: Schema.Types.ObjectId,
      ref: 'carsappCarcolors',
      required: false
    },
    interiorColor: {
      type: Schema.Types.ObjectId,
      ref: 'carsapp_interiorcolors'
    },
    carBackLight: {
      type: Schema.Types.ObjectId,
      ref: 'carsappCarbacklights'
    },
    carBodyType: {
      type: Schema.Types.ObjectId,
      ref: 'carsappCarbodytypes'
    },
    carBrake: {
      type: Schema.Types.ObjectId,
      ref: 'carsappCarbrakes'
    },
    carEngine: {
      type: Schema.Types.ObjectId,
      ref: 'carsappCarengines'
    },
    carFuel: {
      type: Schema.Types.ObjectId,
      ref: 'carsappCarfueles'
    },
    carHeadLight: {
      type: Schema.Types.ObjectId,
      ref: 'carsappCarheadlights'
    },
    carLocation: {
      type: Schema.Types.ObjectId,
      ref: 'carsappCarlocations'
    },
    carManufacturer: {
      _id: {
        type: Schema.Types.ObjectId,
        ef: 'carsappCarmanufacturers',
        required: true,
      },
      makerName: {
        type: String,
        required: true,
      },
    },
    carSeats: {
      type: Schema.Types.ObjectId,
      ref: 'carsappCarbodytypes'
    },
    carSuspension: {
      type: Schema.Types.ObjectId,
      ref: 'carsappCarsuspensions'
    },
    carType: {
      type: Schema.Types.ObjectId,
      ref: 'carsappCartypes'
    },
    modelName: {
      _id: {
        type: Schema.Types.ObjectId,
        ef: 'carsappCarmodels',
        required: true,
      },
      modelName: {
        type: String,
        required: true,
      },
      releaseYear: {
        type: String,
        required: false,
      },
    },
    carFeatures: [{
      type: Schema.Types.ObjectId,
      ref: 'carsappCarfeatures'
    }],
    wheelType: {
      type: Schema.Types.ObjectId,
      ref: 'carsappCarwheels'
    },
    isFeatured: {
      type: Boolean,
      required: false
    },
    isActive: {
      type: Boolean,
      required: false
    },
    modelCar: {
      type: Boolean,
      required: false
    },
    fixedPrice: {
      type: Number,
      required: false
    },
    priceTo: {
      type: Number,
      required: false
    },
    priceFrom: {
      type: Number,
      required: false
    },
    seatingCapacity: {
      type: Number,
      required: false
    },
    engineCapacity: {
      type: Number,
      required: false
    },
    carMileage: {
      type: Number,
      required: false
    },
    images: [
      {
        type: String,
        required: false
      }
    ],
    videoLink:
    {
      type: String,
      required: false
    },
    carCity: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'districts',
        required: false
      },
      name: {
        type: String,
        required: false,
        trim: true,
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)
