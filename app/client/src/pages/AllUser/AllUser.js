import React, { useMemo, useState } from "react";
import styles from "./AllUser.module.css";
import PageHeader from "./PageHeader";
import SearchBar from "./SearchBar";
import EmployeeSection from "./EmployeeSection";
import SummarySection from "./SummarySection";
import AddEmployeeModal from "./AddEmployeeModal";

import { useGetAllUsersQuery } from "../../services/userApi";

const AllUser = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [activeSection, setActiveSection] = useState(null);

    // Fetch all users
    const { data: usersData, isLoading } = useGetAllUsersQuery();

    // Normalize API response
    const users = Array.isArray(usersData)
        ? usersData
        : Array.isArray(usersData?.data)
            ? usersData.data
            : Array.isArray(usersData?.users)
                ? usersData.users
                : [];

    // Global search
    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;
        const q = searchTerm.toLowerCase();
        return users.filter((u) =>
            `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q)
        );
    }, [searchTerm, users]);

    // ---- ROLE GROUPS (sirf layout ke liye) ----
    const managementUsers = filteredUsers.filter((u) => {
        const r = (u.role || "").toLowerCase();
        return (
            r.includes("ceo") ||
            r.includes("cfo") ||
            r.includes("manager") ||
            r.includes("management")
        );
    });

    const investigationsUsers = filteredUsers.filter((u) => {
        const r = (u.role || "").toLowerCase();
        return (
            r.includes("analist") ||
            r.includes("analyst") ||
            r.includes("detectiv") ||
            r.includes("investig")
        );
    });

    // jo na upar aaya na yahan, wo auxiliar
    const auxiliaryUsers = filteredUsers.filter(
        (u) => !managementUsers.includes(u) && !investigationsUsers.includes(u)
    );

    // ---- Modal control ----
    const openModal = (sectionKey) => {
        setActiveSection(sectionKey);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setActiveSection(null);
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading users...</div>;
    }

    return (
        <div className={styles.page}>
            {/* HEADER */}
            <PageHeader
                title="Lista angajaților"
                onBack={() => window.history.back()}
            />

            {/* SEARCH */}
            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Caută angajat după nume..."
            />

            {/* ========= MANAGEMENT ========= */}
            <EmployeeSection type="management" onAddClick={openModal} />
            <EmployeeSection type="investigatii" onAddClick={openModal} />
            <EmployeeSection type="auxiliar" onAddClick={openModal} />

            {/* ========= REZUMAT ========= */}
            <SummarySection
                totalEmployees={filteredUsers.length}
                totalMonthlyCost="115 806 RON" // abhi hardcoded
            />

            {/* ========= POPUP COMPONENT ========= */}
            <AddEmployeeModal
                isOpen={showModal}
                sectionKey={activeSection}
                onClose={closeModal}
            />
        </div>
    );
};

export default AllUser;
