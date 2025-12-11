import { Schema, model, Document } from "mongoose";

export interface IAnalystExpanse extends Document {

    analystId?: Schema.Types.ObjectId;
    projectId: Schema.Types.ObjectId;
    totalSecands?:number;

}

const analystExpanseSchema = new Schema<IAnalystExpanse>(
    {
       analystId:{
           type: Schema.Types.ObjectId,
           ref: "User",
           default: null,

       },

        projectId: {
            type: Schema.Types.ObjectId,
            ref: "ProjectRequest",
            default: null,
        },

        totalSecands:{
           type: Number,
           required: false,default: 0,
        },


    },
    { timestamps: true }
);

const AnalystExpanse = model<IAnalystExpanse>("AnalystExpanse", analystExpanseSchema);

export default AnalystExpanse;
