import mongoose from "mongoose";

const mediaSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        file: {
            data: Buffer,
            contentType: String,
        }
    },
    { timestamps: true }
);

const MediaModel = mongoose.model("Media", mediaSchema);

export default MediaModel;