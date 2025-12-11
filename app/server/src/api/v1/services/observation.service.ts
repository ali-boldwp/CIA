import Observation , { IObservation } from "../models/observation.model";


export const createObservation = async (data: Partial<IObservation>) => {
    return await Observation.create(data);
};


export const getObservationByProjectId = async (projectId: string) => {
    return Observation.find({ projectId })
        .populate("projectId")
        .lean();
};