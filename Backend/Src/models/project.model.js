import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
        name:{
            type: String,
            required: true,
            trim: true
        },
        orgId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        }
},{
    timestamps: true
})

export default mongoose.model("Project", projectSchema);