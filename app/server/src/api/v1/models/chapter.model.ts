import {Schema, model, Document, Types} from "mongoose";

export interface IChapter extends Document {
    name: string;
    projectId:Types.ObjectId;
}

const chapterSchema = new Schema<IChapter>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        projectId: {
            type: Schema.Types.ObjectId,
           ref: "ProjectRequest",

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

const Chapter = model<IChapter>("Chapter", chapterSchema);

export default Chapter;
