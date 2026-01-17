import React from 'react';
import styles from './SectionHeader.module.css';

const SectionHeader = ({ mainTitle, subTitle }) => {
    return (
        <div className={styles.sectionHeader}>
            <h1 className={styles.mainTitle}>{mainTitle}</h1>
            <h2 className={styles.subTitle}>{subTitle}</h2>

        </div>
    );
};

export default SectionHeader;