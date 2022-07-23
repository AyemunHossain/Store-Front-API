import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const ProductSchema = new mongoose.Schema(
  {
    readOnly: {
      type: Boolean,
      required: false,
    },
    Name: {
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
    productType: {
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
    Status: {
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
      ref: 'User'
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant'
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin'
    },
    approved:{
      type: Boolean,
      required:false
    },
    // exteriorColor: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCarcolors',
    //   required: false
    // },
    // interiorColor: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsapp_interiorcolors'
    // },
    // BackLight: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCarbacklights'
    // },
    // BodyType: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCarbodytypes'
    // },
    // Brake: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCarbrakes'
    // },
    // Engine: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCarengines'
    // },
    // Fuel: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCarfueles'
    // },
    // HeadLight: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCarheadlights'
    // },
    // Location: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCarlocations'
    // },
    Manufacturer: {
      _id: {
        type: Schema.Types.ObjectId,
        ef: 'Manufacturer',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    // Seats: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCarbodytypes'
    // },
    // Suspension: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCarsuspensions'
    // },
    // Type: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCartypes'
    // },
    // modelName: {
    //   _id: {
    //     type: Schema.Types.ObjectId,
    //     ef: 'carsappCarmodels',
    //     required: true,
    //   },
    //   modelName: {
    //     type: String,
    //     required: true,
    //   },
    //   releaseYear: {
    //     type: String,
    //     required: false,
    //   },
    // },
    // Features: [{
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCarfeatures'
    // }],
    // wheelType: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'carsappCarwheels'
    // },
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
    Mileage: {
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
    // City: {
    //   _id: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'districts',
    //     required: false
    //   },
    //   name: {
    //     type: String,
    //     required: false,
    //     trim: true,
    //   },
    // },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)
