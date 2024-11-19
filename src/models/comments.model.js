import mongoose, { model, Schema } from "mongoose";

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

export const Comment = mongoose.model("Comment", CommentSchema);
