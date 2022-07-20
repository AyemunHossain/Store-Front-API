import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const CarFeaturesSchema = new mongoose.Schema(
  {
    feature_name: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: false
    },
    
    featureStatus: {
      type: Boolean,
      required: false
    },
    },
    {
        timestamps: true
    }
)