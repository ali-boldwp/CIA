import React, { useEffect, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import styles from "./styles.module.css";
import ImagePlaceholder from "./ImagePlaceholder";

const LOCAL_STORAGE_KEY = "participatiiFormData";

const Index = ({ formValues, setFormValues, onSaveSection }) => {
    const isInitialized = useRef(false);

    const { control, watch, setValue, handleSubmit } = useForm({
        defaultValues: {
            introducere: "",
            companies: [
                {
                    name: "ABC SRL",
                    status: "active",
                    cui: "",
                    dateInf: "",
                    sediu: "",
                    caen: "",
                    cifraAfaceri: "",
                    profit: "",
                    angajati: "",
                    actionariat: ""
                }
            ],
            images: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "companies"
    });

    const introducere = watch("introducere");
    const companies = watch("companies");
    const images = watch("images");
    const allData = watch();

    // ===== Initialize from localStorage or parent =====
    useEffect(() => {
        if (isInitialized.current) return;

        const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

        if (savedData) {
            setValue("introducere", savedData.introducere || "");
            setValue("companies", savedData.companies && savedData.companies.length > 0 ? savedData.companies : fields);
            setValue("images", savedData.images || []);
        } else if (formValues?.participatii) {
            const data = formValues.participatii;
            setValue("introducere", data.introducere || "");
            setValue("companies", data.companies && data.companies.length > 0 ? data.companies : fields);
            setValue("images", data.images || []);
        }

        isInitialized.current = true;
    }, [formValues, setValue, fields]);

    // ===== Auto-save to localStorage + sync parent =====
    useEffect(() => {
        if (!isInitialized.current) return;

        const dataToSave = { introducere, companies, images };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));

        if (setFormValues) {
            setFormValues(prev => ({
                ...prev,
                participatii: dataToSave
            }));
        }
    }, [introducere, companies, images, setFormValues]);

    // ===== Handlers =====
    const addCompany = () => append({
        name: "",
        status: "active",
        cui: "",
        dateInf: "",
        sediu: "",
        caen: "",
        cifraAfaceri: "",
        profit: "",
        angajati: "",
        actionariat: ""
    });

    const deleteCompany = (index) => {
        remove(index);
        if (companies.length === 1) addCompany(); // always at least 1
    };

    // ===== Images Handler =====
    const handleImagesChange = (imgs) => {
        // Agar imgs empty hai to empty array, nahi to jo mile wo
        setValue("images", imgs && imgs.length > 0 ? imgs : []);
    };


    const onSubmit = (data) => {
        console.log("FINAL PAYLOAD:", data);
        if (onSaveSection) onSaveSection({ data: { participatii: data } });
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <h1 className={styles.mainTitle}>
                    I. Societatea ABC | 9. Participatii in alte societati
                </h1>

                {/* Introducere */}
                <div className={styles.textAreaWrapper}>
                    <h3 className={styles.sectionTitle}>💬 Introducere</h3>
                    <Controller
                        name="introducere"
                        control={control}
                        render={({ field }) => (
                            <textarea
                                className={styles.textarea}
                                placeholder="In urma verificarilor efectuate..."
                                {...field}
                            />
                        )}
                    />
                    <div className={styles.deleteBoxContainer}>
                        <button className={styles.deleteBox} onClick={() => setValue("introducere", "")}>
                            Șterge căsuța
                        </button>
                    </div>
                </div>

                {/* Tabel participatii */}
                <h3 className={styles.sectionTitle}>📋 Tabel participatii in alte societati</h3>
                <table className={styles.editableTableIstoric2}>
                    <thead>
                    <tr>
                        <th>DENUMIRE SOCIETATE</th>
                        <th>DETALII SOCIETATE</th>
                        <th>STRUCTURA ACTIONARIAT</th>
                        <th>ACTIUNI</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fields.map((c, index) => (
                        <tr key={c.id}>
                            {/* DENUMIRE + STATUS */}
                            <td>
                                <Controller
                                    name={`companies.${index}.name`}
                                    control={control}
                                    render={({ field }) => <strong {...field} />}
                                />
                                <div className={styles.status}>
                                    {c.status === "active" ? (
                                        <span className={styles.active}>✔ societate activa</span>
                                    ) : (
                                        <span className={styles.inactive}>✖ Radiata din [anul]</span>
                                    )}
                                </div>
                            </td>

                            {/* DETALII */}
                            <td className={styles.details}>
                                {["cui","dateInf","sediu","caen","cifraAfaceri","profit","angajati"].map(fld => (
                                    <div key={fld} className={styles.display}>
                                        <b>{fld.toUpperCase().replace(/([A-Z])/g, ' $1')}:</b>
                                        <Controller
                                            name={`companies.${index}.${fld}`}
                                            control={control}
                                            render={({ field }) => <input {...field} placeholder="[completeaza aici]" />}
                                        />
                                    </div>
                                ))}
                            </td>

                            {/* ACTIONARIAT */}
                            <td>
                                <Controller
                                    name={`companies.${index}.actionariat`}
                                    control={control}
                                    render={({ field }) => (
                                        <textarea {...field} className={styles.actionariat} placeholder="[Structura actionariatului]" />
                                    )}
                                />
                            </td>

                            {/* DELETE */}
                            <td>
                                <button className={styles.trash} onClick={() => deleteCompany(index)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Add new row */}
                <button className={styles.addRow} onClick={addCompany}>+ Adaugă rând</button>

                {/* Images */}
                <div className={styles.imagesSection}>
                    <h3 className={styles.sectionTitle}>🖼️ Imagini / grafice</h3>
                    <ImagePlaceholder
                        images={images && images.length > 0 ? images : []}
                        setImages={handleImagesChange}
                    />

                </div>

                {/* Navigation / Save */}
                <div className={styles.navigation}>
                    <div className={styles.navButtons}>
                        <button className={styles.saveButton} onClick={handleSubmit(onSubmit)}>
                            <span className={styles.saveIcon}>💾</span> Salveaza sectiunea
                        </button>

                        <button className={styles.middleButton}>
                            ❌ Exclude acest capitol
                            <span className={styles.arrowIcon}>→</span>
                        </button>

                        <button className={styles.nextButton}>
                            ➡️ Mergi la I.3. „Date financiare”
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Index;
