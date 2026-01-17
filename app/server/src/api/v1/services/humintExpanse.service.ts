import HumintExpanse, { IHumintExpanse } from "../models/humintExpanse.model";

export const createHumintExpanse = async (data: Partial<IHumintExpanse>) => {
    if (!data.project) {
        throw new Error("projectId is required");
    }
    return await HumintExpanse.create(data);
};


export const getAllHumintExpenses = async (filters: any = {}) => {
    return await HumintExpanse.find(filters)
        .populate("createdBy", "name email");
};


export const getHumintExpenseById = async (id: string, project: string) => {
    return await HumintExpanse.findOne({ _id: id, project })
        .populate("createdBy", "name email");
};

export const updateHumintExpense = async (
    id: string,
    project: string,
    data: Partial<IHumintExpanse>
) => {
    return await HumintExpanse.findOneAndUpdate(
        { _id: id, project },
        data,
        { new: true }
    );
};

export const deleteHumintExpense = async (id: string, project: string) => {
    return await HumintExpanse.findOneAndDelete({ _id: id, project });
};


export const getHumintTotalGrouped = async (project: string) => {
    const expenses = await HumintExpanse.find({ project });

    let EUR = 0, RON = 0, USD = 0;

    expenses.forEach(e => {
        if (e.currency === "EUR") EUR += e.total;
        if (e.currency === "RON") RON += e.total;
        if (e.currency === "USD") USD += e.total;
    });

    return { EUR, RON, USD };
};
