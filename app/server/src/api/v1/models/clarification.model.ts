import {Schema, model, Document, Types} from "mongoose";

export interface IClarification extends Document {
    clarificationText: string;
    userId:Types.ObjectId;
    humintId:Types.ObjectId;
}

const clarificationSchema = new Schema<IClarification>(
    {
        clarificationText: {
            type: String,
            required: true,
            trim: true
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required : true,

        },
        humintId:{
            type : Schema.Types.ObjectId,
            ref: "Humint",
            required : true,

        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                delete ret.__v;
                return ret;
            }
        }
    }
);

const Clarification = model<IClarification>("Clarification", clarificationSchema);

export default Clarification;
