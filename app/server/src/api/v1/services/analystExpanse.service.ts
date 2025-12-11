import AnalystExpanse from "../models/analystExpanse.model";

export const getAnalystExpansesByProject = async (projectId: string) => {
    return await AnalystExpanse.find({ projectId })
        .populate("analystId")
        .populate("projectId")// optional
        .sort({ createdAt: -1 });
};
