import React, { useState, useEffect ,useRef} from 'react';
import styles from './styles.module.css';
import TitleSection from "./TitleSection";
import TextAreaSection from './TextAreaSection';
import TableSection from './TableSection';
import ImageSection from './ImageSection';

const Index = ({ formValues, setFormValues, onSaveSection }) => {

    /* =========================
       LOCAL STATE
    ========================== */
    const isInitialized = useRef(false);


    const [title, setTitle] = useState("");
    const [introText, setIntroText] = useState("");
    const [contractPartnertable, setContractPartnertable] = useState({
        columns: ["Denumire", "Descriere"],
        rows: [["", ""]]
    });

    const [images, setImages] = useState([null]);

    /* =========================
       INIT FROM FORM VALUES
    ========================== */
    useEffect(() => {
        if (isInitialized.current) return;

        setTitle(formValues?.mainSection?.title || "");
        setIntroText(formValues?.mainSection?.introText || "In urma verificării surselor disponibile...");

        const rawTable = formValues?.mainSection?.table;
        if (rawTable) {
            // new object reference
            setContractPartnertable({
                columns: Array.isArray(rawTable.columns) ? [...rawTable.columns] : ["Denumire", "Descriere"],
                rows: Array.isArray(rawTable.rows)
                    ? rawTable.rows.map(r => [r[0] ?? "", r[1] ?? ""])
                    : [["", ""]]
            });
        }

        setImages(formValues?.mainSection?.images || [null]);

        isInitialized.current = true;
    }, []); // first render only
// dependency array empty → only first load





    /* =========================
       TABLE HANDLERS (2D array)
    ========================== */
    const addRow = () => {
        setContractPartnertable(prev => ({
            ...prev,
            rows: [...prev.rows, ["", ""]]
        }));
    }

    const deleteRow = (index) => {
        setContractPartnertable(prev => ({
            ...prev,
            rows: prev.rows.filter((_, i) => i !== index)
        }));
    }

    const handleCellChange = (rowIndex, colIndex, value) => {
        setContractPartnertable(prev => ({
            ...prev,
            rows: prev.rows.map((row, i) =>
                i === rowIndex ? [...row.map((cell, j) => (j === colIndex ? value : cell))] : row
            )
        }));
    };



    /* =========================
       IMAGE HANDLER
    ========================== */
    const handleImagesChange = (imgs) => setImages(imgs);

    /* =========================
       SAVE HANDLER
    ========================== */
    const handleSave = () => {
        const payload = {
            data: {
                mainSection: {
                    title,
                    introText,
                    table: {
                        columns: [...contractPartnertable.columns],
                        rows: contractPartnertable.rows.map(r => [...r])
                    },
                    images
                }
            }
        };

        console.log("FINAL PAYLOAD FOR API:", payload);

        onSaveSection && onSaveSection(payload);

        setFormValues(prev => ({
            ...prev,
            mainSection: payload.data.mainSection
        }));
    };




    /* =========================
       UI
    ========================== */
    return (
        <div className={styles.container}>
            <div className={styles.mainCard}>

                <TitleSection value={title} onChange={setTitle} />
                <TextAreaSection
                    value={introText}
                    onChange={setIntroText}
                    onClear={() => setIntroText("")}
                />

                <TableSection
                    columns={contractPartnertable.columns}
                    rows={contractPartnertable.rows}
                    addRow={addRow}
                    deleteRow={deleteRow}
                    handleCellChange={handleCellChange}
                />


                <div className={styles.sectionWrapper}>
                    <ImageSection
                        images={images}
                        setImages={handleImagesChange}
                    />
                </div>

                <div className={styles.navigation}>
                    <button className={styles.saveButton} onClick={handleSave}>
                        💾 Salvează secțiunea
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
    );
};

export default Index;
