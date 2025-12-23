import AnalystExpanse from "../models/analystExpanse.model";
import User from "../models/user.model";
import * as analystExpanseService from '../services/analystExpanse.service'

export const getAnalystsFinalSalary = async (req, res) => {
    try {
        const analysts = await User.find({ role: "analyst" });

        const report = [];

        // ✔ Static conversion rate (No URL needed)
        const EUR_RATE = 0.20; // 1 RON = 0.20 EUR

        let totalSalaryRON = 0;
        let totalSalaryEUR = 0;

        for (const analyst of analysts) {

            const monthlySalary = analyst.monthlySalary || 0; // RON
            const costPerHour = analyst.costPerHour || 0;     // RON/hour
            const bonus = analyst.bonus || 0;                 // RON

            const expanses = await AnalystExpanse.find({ analystId: analyst._id });

            const totalSeconds = expanses.reduce((acc, rec) => acc + rec.totalSecands, 0);
            const taskHours = totalSeconds / 3600;

            const taskSalary = taskHours * costPerHour; // RON

            const finalSalaryRON = monthlySalary + taskSalary + bonus;

            const finalSalaryEuro = finalSalaryRON * EUR_RATE; // convert to euro

            totalSalaryRON += finalSalaryRON;
            totalSalaryEUR += finalSalaryEuro;

            report.push({
                analystId: analyst._id,
                analystName: analyst.name,
                role: analyst.analystRole,
                monthlySalary,
                costPerHour,
                taskHours: taskHours.toFixed(2),
                taskSalary: taskSalary.toFixed(2),
                bonus,
                finalSalaryRON: finalSalaryRON.toFixed(2),
                finalSalaryEuro: finalSalaryEuro.toFixed(2),
                usedRate: EUR_RATE
            });
        }

        res.json({
            message: "Final salary calculated for all analysts (Static Euro Rate)",
            usedRate: EUR_RATE,
            totalSalaryRON: totalSalaryRON.toFixed(2),
            totalSalaryEUR: totalSalaryEUR.toFixed(2),
            count: report.length,
            data: report
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getProjectAnalystExpanse = async (req, res) => {
    try {
        const { projectId } = req.params;

        const expanses = await analystExpanseService.getAnalystExpansesByProject(projectId);

        const RON_TO_EUR = 0.20;

        const updatedExpanses = expanses.map((exp) => {
            const analyst = exp.analystId;

            const costPerHourLei = analyst?.costPerHour || 0;
            const costPerHourEuro = Number((costPerHourLei * RON_TO_EUR).toFixed(2));

            return {
                ...exp.toObject(),
                analystId: {
                    ...analyst.toObject(),
                    costPerHourLei,
                    costPerHourEuro
                }
            };
        });

        res.json({
            success: true,
            totalAnalysts: updatedExpanses.length,
            expanses: updatedExpanses
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

