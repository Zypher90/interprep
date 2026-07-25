import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "TokenName is required"],
    }
}, {
    timestamps: true
})

const blacklistModel = mongoose.model("Blacklist", blacklistTokenSchema);

export default blacklistModel;