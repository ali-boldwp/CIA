import { Request, Response, NextFunction } from "express";
import * as humintExpanseService from "../services/humintExpanse.service";

export const createHumintExpanse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { project, date, description, utility, cost, currency, taxPercent } = req.body;

        const taxIncludedCost = cost + (cost * (taxPercent / 100));
        const total = taxIncludedCost;

        const expanse = await humintExpanseService.createHumintExpanse({
            project,
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
        const { project } = req.query;

        const list = await humintExpanseService.getAllHumintExpenses({
            project
        });

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
        const { project } = req.body;

        const updated = await humintExpanseService.updateHumintExpense(
            req.params.id,
            project,
            req.body
        );

        res.json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};


export const deleteHumintExpense = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { project } = req.query;

        const deleted = await humintExpanseService.deleteHumintExpense(
            req.params.id,
            project as string
        );

        res.json({ success: true, data: deleted });
    } catch (err) {
        next(err);
    }
};


export const getHumintTotal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { project } = req.query;

        const totals = await humintExpanseService.getHumintTotalGrouped(
            project as string
        );

        res.json({ success: true, totals });
    } catch (err) {
        next(err);
    }
};

