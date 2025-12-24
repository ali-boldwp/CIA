import React from "react";
import styles from "./Header.module.css";
import { FaEye } from "react-icons/fa";
import { Link, useLocation, useParams } from "react-router-dom";
import { useGetCategoryByIdQuery } from "../../../../services/categoryApi";

const Header = () => {
    const location = useLocation();
    const { id:categoryId } = useParams();

    // ===== CATEGORY PAGE =====
    const isCategoryPage =
        location.pathname.startsWith("/categories/") &&
        !location.pathname.includes("/chapter/");

    // ===== CHAPTER PAGE =====
    const isChapterPage = location.pathname.includes("/chapter/");

    // Fetch category ONLY for category page
    const { data: categoryData } = useGetCategoryByIdQuery(categoryId, {
        skip: !isCategoryPage || !categoryId,
    });

    let title = "Loading...";

    if (isCategoryPage) {
        title = categoryData?.data?.name || "Category";
    }

    if (isChapterPage) {
        title = "Chapter Tasks"; // ✅ STATIC NAME
    }

    return (
        <div className={styles.header}>
            <Link to="/categories" className={styles.headerLeft}>
                <span className={styles.arrow}>←</span>
                <span>Go back</span>
            </Link>

            <div className={styles.headerCenter}>
                {title}
            </div>

            <div className={styles.headerRight}>
                <FaEye />
            </div>
        </div>
    );
};

export default Header;
