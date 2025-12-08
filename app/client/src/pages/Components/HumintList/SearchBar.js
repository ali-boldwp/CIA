import React from "react";
import styles from "./SearchBar.module.css";

const SearchBar = ({
                       searchValue,
                       onSearchChange,
                       sortValue,
                       onSortChange,
                       priorityValue,
                       onPriorityChange,
                       onApproveSelected,
                       hasSelection
                   }) => {
    return (
        <div className={styles.container}>
            <div className={styles.box}>

                {/* LEFT: SEARCH INPUT */}
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="🔎 Caută: proiect / subiect / responsabil"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* RIGHT: FILTERS + APPROVE BUTTON */}
                <div className={styles.filters}>

                    {/* Sort Filter */}
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Sortează</span>
                        <select
                            className={styles.selectBtn}
                            value={sortValue}
                            onChange={(e) => onSortChange(e.target.value)}
                        >
                            <option value="date">După dată</option>
                            <option value="deadline">După deadline</option>
                        </select>
                    </div>

                    {/* Priority Filter */}
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>Prioritate</span>
                        <select
                            className={styles.selectBtn}
                            value={priorityValue}
                            onChange={(e) => onPriorityChange(e.target.value)}
                        >
                            <option value="Toate">Toate</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Normal">Normal</option>
                            <option value="Confidențial">Confidențial</option>
                        </select>
                    </div>

                    {/* 🔥 APPROVE SELECTED BUTTON */}
                    <button
                        className={`${styles.approveBtn} ${
                            !hasSelection ? styles.approveBtnDisabled : ""
                        }`}
                        disabled={!hasSelection}
                        onClick={onApproveSelected}
                    >
                        Aprobă selectate
                    </button>

                </div>
            </div>
        </div>
    );
};

export default SearchBar;
