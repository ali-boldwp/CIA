import Clarification , { IClarification } from "../models/clarification.model";

export const createClarification = async (data: Partial<IClarification>) => {
    return await Clarification.create(data);
};

// 🔹 sari clarifications for given HUMINT
export const getClarificationHumintById = async (humintId: string) => {
    return await Clarification
        .find({ humintId })
        .populate("userId", "name")       
        .sort({ createdAt: 1 });
};
