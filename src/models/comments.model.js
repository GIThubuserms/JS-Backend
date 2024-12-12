import mongoose, {Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const CommentSchema = new Schema(
  {
    vedio: {
      type: Schema.Types.ObjectId,
      ref: "Vedio",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


CommentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", CommentSchema);
