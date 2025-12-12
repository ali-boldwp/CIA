import { Request, Response, NextFunction } from "express";
import * as humintExpanseService from "../services/humintExpanse.service";

export const createHumintExpanse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { date, description, utility, cost, currency, taxPercent} = req.body;

        const taxIncludedCost = cost + (cost * (taxPercent / 100));
        const total = taxIncludedCost;

        const expanse = await humintExpanseService.createHumintExpanse({
            date,
            description,
            utility,
            cost,
            currency,
            taxPercent,
            taxIncludedCost,
            total,
            createdBy: userId
        });

        res.json({ success: true, data: expanse });

    } catch (err) {
        next(err);
    }
};

export const getAllHumintExpenses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await humintExpanseService.getAllHumintExpenses(req.query);
        res.json({ success: true, data: list });
    } catch (err) {
        next(err);
    }
};

export const getHumintExpenseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const item = await humintExpanseService.getHumintExpenseById(req.params.id);
        res.json({ success: true, data: item });
    } catch (err) {
        next(err);
    }
};

export const updateHumintExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await humintExpanseService.updateHumintExpense(req.params.id, req.body);
        res.json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};

export const deleteHumintExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await humintExpanseService.deleteHumintExpense(req.params.id);
        res.json({ success: true, data: deleted });
    } catch (err) {
        next(err);
    }
};

export const getHumintTotal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totals = await humintExpanseService.getHumintTotalGrouped();
        res.json({ success: true, totals });
    } catch (err) {
        next(err);
    }
};
