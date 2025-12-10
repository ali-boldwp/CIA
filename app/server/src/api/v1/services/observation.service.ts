import Observation , { IObservation } from "../models/observation.model";
import ProjectRequest from "../models/projectRequest.model";


export const createObservation = async (data: Partial<IObservation>) => {
    return await Observation.create(data);
};


export const getObservationProjectById = async (projectId: string) => {
    return await Observation
        .find({ projectId })
        .populate("userId", "name")
        .sort({ createdAt: 1 });
};
