import Clarification , { IClarification } from "../models/clarification.model";
import Humint , {IHumint} from "../models/humint.model";

export const createClarification = async (data: Partial<IClarification>) => {
    return await Clarification.create(data);
};

export const getClarificationHumintById = async (id: string) => {
    return await Clarification.findById(id)

};