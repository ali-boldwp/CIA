import {Schema, model, Document, Types} from "mongoose";

export interface IObservation extends Document {
    text: string;
    userId:Types.ObjectId;
    projectId:Types.ObjectId;
}

const observationSchema = new Schema<IObservation>(
    {
        text: {
            type: String,
            required: true,
            trim: true
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",

        },
        projectId: {
            type : Schema.Types.ObjectId,
            ref: "ProjectRequest",
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

const Observation = model<IObservation>("Observation", observationSchema);

export default Observation;
