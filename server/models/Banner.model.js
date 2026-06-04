import { model, Schema } from "mongoose";

const bannerSchema = new Schema({
  image: {
    type: String,
    required: [true, 'Banner image is required'],
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default model('Banner', bannerSchema);
