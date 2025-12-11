import HumintExpanse, { IHumintExpanse } from "../models/humintExpanse.model";

export const createHumintExpanse = async (data: Partial<IHumintExpanse>) => {
    return await HumintExpanse.create(data);
};

export const getAllHumintExpenses = async (filters: any = {}) => {
    return await HumintExpanse.find(filters)
        .populate("createdBy", "name email")
};

export const getHumintExpenseById = async (id: string) => {
    return await HumintExpanse.findById(id)
        .populate("createdBy", "name email")
};

export const updateHumintExpense = async (id: string, data: Partial<IHumintExpanse>) => {
    return await HumintExpanse.findByIdAndUpdate(id, data, { new: true });
};

export const deleteHumintExpense = async (id: string) => {
    return await HumintExpanse.findByIdAndDelete(id);
};

export const getHumintTotalGrouped = async () => {
    const expenses = await HumintExpanse.find();

    let EUR = 0, RON = 0, USD = 0;

    expenses.forEach(e => {
        if (e.currency === "EUR") EUR += e.total;
        if (e.currency === "RON") RON += e.total;
        if (e.currency === "USD") USD += e.total;
    });

    return { EUR, RON, USD };
};
