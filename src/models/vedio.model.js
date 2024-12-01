import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const VedioSchema = new Schema(
  {
    Vediofile: {
      type: String,
      required: true,
    },
    Thumbnail: {
      type: String,
      required: true,
    },
    Owner: {
        type:Schema.Types.ObjectId,
        ref:'User'

    },
    Title: {
      type: String,
      required: true,
    },
    Discription: {
      type: String,
      required: true,
    },
    Duration: {
      type: Number,
      required:true
    },
    Views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// For the vedios pagiantion and filter 
VedioSchema.plugin(mongooseAggregatePaginate)

export const Vedio = mongoose.model("Vedio", VedioSchema);
