// /home/ubaid/workspace/app/client/src/pages/Humint/CustumPopUp.js

import React from "react";
import styles from "./CustumPop.module.css";

const CustumPopUp = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>
                {/* TITLE */}
                <h3 className={styles.title}>
                    Solicitare independentă — context minim
                </h3>
                <p className={styles.subtitle}>
                    Dacă nu există un proiect asociat, completează contextul minim
                    pentru HUMINT:
                </p>

                {/* FORM */}
                <div className={styles.form}>
                    {/* ROW 1 */}
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Subiect HUMINT</label>
                            <input
                                className={styles.input}
                                placeholder="ex.: Observare discretă — sediu ABC"
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Tip entitate</label>
                            <button className={styles.select}>
                                Persoană / Societate / Alt ▾
                            </button>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Deadline</label>
                            <input
                                className={styles.input}
                                placeholder="aaaa-ll-zz"
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Prioritate</label>
                            <button className={styles.select}>Normal ▾</button>
                        </div>
                    </div>

                    {/* ROW 2 */}
                    <div className={styles.row}>
                        <div className={`${styles.field} ${styles.fieldWide}`}>
                            <label className={styles.label}>Responsabil</label>
                            <button className={styles.select}>
                                Alege responsabil ▾
                            </button>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>
                                Creează proiect nou din solicitare
                            </label>
                            <button className={styles.select}>Da / Nu ▾</button>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label}>Notifică manager</label>
                            <button className={styles.select}>Da ▾</button>
                        </div>
                    </div>
                </div>

                {/* BUTTON */}
                <div className={styles.buttonRow}>
                    <button className={styles.continueBtn}>Continuă</button>
                </div>
            </div>
        </div>
    );
};

export default CustumPopUp;
