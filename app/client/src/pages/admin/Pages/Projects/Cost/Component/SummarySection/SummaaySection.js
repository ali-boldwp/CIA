import React from 'react';
import styles from './SummarySection.module.css';
import { useParams } from "react-router-dom";
import {useGetProjectFinancialStatesQuery , useGetCreateProjectByIdQuery} from "../../../../../../../services/projectApi";

const SummarySection = ({ employeeTotalCost = 0 }) => {
    const { id: projectId } = useParams();

    // Financial stats
    const { data: financialRes } =
        useGetProjectFinancialStatesQuery(projectId);

    // Project details
    const { data: projectRes } =
        useGetCreateProjectByIdQuery(projectId);

    const stats = financialRes?.data || {};
    const project = projectRes?.data || {};
    const currency = stats.currency || "EUR";

    return (
        <div className={styles.topRow}>
            {/* LEFT: PROJECT DETAILS */}
            <div className={`${styles.formCard} ${styles.projectCard}`}>
                <h2 className={styles.formTitle}>Detalii proiect</h2>

                <div className={styles.projectBlock}>
                    <ul>
                        <li>
                            <b>Denumire proiect</b>
                            <span>{project.projectName || "—"}</span>
                        </li>

                        <li>
                            <b>Tip raport</b>
                            <span>{project.reportType || "—"}</span>
                        </li>

                        <li>
                            <b>Tip entitate / caz</b>
                            <span>{project.entityType || "—"}</span>
                        </li>

                        <li>
                            <b>Nume client</b>
                            <span>{project.clientName || "—"}</span>
                        </li>

                        <li>
                            <b>Responsabil proiect</b>
                            <span>{project.responsibleAnalyst?.name || "—"}</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* RIGHT: FINANCIAL SUMMARY */}
            <div className={`${styles.formCard} ${styles.financeCard}`}>
                <div className={styles.financeHeader}>
                    <h2 className={styles.formTitle}>Rezumat financiar</h2>
                    <button className={styles.currencyUpdateBtn}>
                        Curs EURO (BNR) <span>actualizat</span>
                    </button>
                </div>

                <div className={styles.financialGrid}>
                    {/* Row 1 */}
                    <div className={`${styles.summaryBox} ${styles.boxGray}`}>
                        <span className={styles.sLabel}>Cheltuieli angajati</span>
                        <span className={styles.sValue}>
                            {employeeTotalCost} {currency}
                        </span>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxTfsa}`}>
                        <span className={styles.sLabel}>Cheltuieli TESA</span>
                        <span className={styles.sValue}>
                            {stats.cheltuieliTESA ?? 0} {currency}
                        </span>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxCyan}`}>
                        <span className={styles.sLabel}>Cheltuieli OSINT</span>
                        <span className={styles.sValue}>
                            {stats.cheltuieliOSINT ?? 0} {currency}
                        </span>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxYellow}`}>
                        <span className={styles.sLabel}>Cheltuieli Supraveghere Tehnică</span>
                        <span className={styles.sValue}>
                            {stats.supraveghereTehnica ?? 0} {currency}
                        </span>
                    </div>

                    {/* Row 2 */}
                    <div className={`${styles.summaryBox} ${styles.boxBlue}`}>
                        <span className={styles.sLabel}>Cheltuieli fixe</span>
                        <span className={styles.sValue}>
                            {stats.cheltuieliFixe ?? 0} {currency}
                        </span>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxOther}`}>
                        <span className={styles.sLabel}>Alte cheltuieli</span>
                        <span className={styles.sValue}>
                            {stats.alteCheltuieli ?? 0} {currency}
                        </span>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxPurple}`}>
                        <span className={styles.sLabel}>Preț proiect</span>
                        <span className={styles.sValue}>
                            {stats.pretProject ?? 0} {currency}
                        </span>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxLightgray}`}>
                        <span className={styles.sLabel}>Total cheltuieli</span>
                        <span className={styles.sValue}>
                            {stats.totalCheltuieli ?? 0} {currency}
                        </span>
                    </div>

                    {/* Row 3 */}
                    <div className={`${styles.summaryBox} ${styles.boxProfit}`}>
                        <div className={styles.profitContainer}>
                            <div className={styles.profitTopRow}>
                                <span className={styles.sLabelGreen}>Profit</span>
                                <span className={styles.profitPercentage}>
                                    {stats.profitPercentage ?? 0}%
                                </span>
                            </div>
                            <div className={styles.profitBottomRow}>
                                <span className={styles.profitValue}>
                                    {stats.profit ?? 0} {currency}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.summaryBox} ${styles.boxDuration}`}>
                        <span className={styles.sLabelDuration}>
                            Durata proiect (zile lucrătoare)
                        </span>
                        <span className={styles.sValueDuration}>—</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummarySection;