import React, { useState } from 'react';
import styles from './EditableTable.module.css';

const EditableTable = ({
                           title,
                           columns,
                           initialData = [],
                           hasAddButton = true,
                           hasCheckboxes = false,
                           isGeneralProfile = false
                       }) => {
    const [data, setData] = useState(initialData);
    const [editingCell, setEditingCell] = useState(null);

    const handleAddRow = () => {
        const newRow = columns.map(col => ({
            value: col.defaultValue || '',
            type: col.type || 'text'
        }));
        setData([...data, newRow]);
    };

    const handleCellChange = (rowIndex, colIndex, value) => {
        const newData = [...data];
        newData[rowIndex][colIndex].value = value;
        setData(newData);
    };

    const handleCellClick = (rowIndex, colIndex) => {
        setEditingCell({ rowIndex, colIndex });
    };

    const renderCell = (cell, rowIndex, colIndex) => {
        if (editingCell?.rowIndex === rowIndex && editingCell?.colIndex === colIndex) {
            if (cell.type === 'select') {
                return (
                    <select
                        className={styles.selectInput}
                        value={cell.value}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        autoFocus
                    >
                        <option value="">Selectează</option>
                        <option value="Actionar">Actionar</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Director">Director</option>
                        <option value="Membru CA">Membru CA</option>
                    </select>
                );
            } else if (cell.type === 'date') {
                return (
                    <input
                        type="date"
                        className={styles.dateInput}
                        value={cell.value}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        autoFocus
                    />
                );
            } else if (cell.type === 'checkbox') {
                return (
                    <div className={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            className={styles.checkboxInput}
                            checked={cell.value === 'true'}
                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.checked.toString())}
                        />
                        <span className={styles.checkboxSymbol}>☐</span>
                    </div>
                );
            } else {
                return (
                    <input
                        type="text"
                        className={styles.textInput}
                        value={cell.value}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        autoFocus
                    />
                );
            }
        }

        // Display mode
        if (cell.type === 'checkbox') {
            return (
                <div className={styles.checkboxDisplay}>
                    <span className={styles.checkboxSymbol}>☐</span>
                    {cell.value === 'true' && <span className={styles.checkmark}>✓</span>}
                </div>
            );
        }

        return (
            <span className={styles.cellValue}>
        {cell.value || `[${cell.type === 'select' ? 'select' : cell.type === 'date' ? 'data' : 'text editabil'}]`}
      </span>
        );
    };

    return (
        <div className={styles.editableTable}>
            <h3 className={styles.tableTitle}>{title}</h3>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={styles.tableHeader}>
                                {col.name}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className={styles.tableRow}>
                            {row.map((cell, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`${styles.tableCell} ${cell.type === 'checkbox' ? styles.checkboxCell : ''}`}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                >
                                    {renderCell(cell, rowIndex, colIndex)}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {hasAddButton && (
                <div className={styles.addButtonContainer}>
                    <button className={styles.addButton} onClick={handleAddRow}>
                        <span className={styles.addIcon}>+</span>
                        Adauga rand
                    </button>
                </div>
            )}

            {title === "Imagini / grafice" && (
                <div className={styles.imageDescription}>
                    Adauga imagini sau grafice (optional).
                </div>
            )}
        </div>
    );
};

export default EditableTable;