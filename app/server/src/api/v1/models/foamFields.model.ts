import {Schema, model, Document, Types} from "mongoose";

export interface IFoamFields extends Document {
    name : string;
    type : string;
    slug : string;
    task : Types.ObjectId;
}

const foamFieldsSchema = new Schema<IFoamFields>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type : String,
            required: false,
        },
        slug : {
            type: String,
            required: false,
        },

        task: {
            type: Schema.Types.ObjectId,
            ref: "TaskTemplate",

        }
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

const FoamFields = model<IFoamFields>("FoamFields", foamFieldsSchema);

export default FoamFields;
