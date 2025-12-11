import React, { useMemo, useState } from "react";
import styles from "./AllUser.module.css";
import PageHeader from "./PageHeader";
import SearchBar from "./SearchBar";
import EmployeeSection from "./EmployeeSection";
import SummarySection from "./SummarySection";
import AddEmployeeModal from "./AddEmployeeModal";


import {toast} from "react-toastify";

const List = ({ isLoading, usersData, deleteUser }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [editUser, setEditUser] = useState(null);



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
    const managementUsers = filteredUsers.filter(u =>
        ["admin", "manager"].includes(u.role)
    );

    const investigationsUsers = filteredUsers.filter(u =>
        u.role === "analyst"
    );

    const auxiliaryUsers = filteredUsers.filter(u =>
        ["sales", "user"].includes(u.role)
    );


    const openModal = (sectionKey) => {
        setEditUser(null);
        setActiveSection(sectionKey);
        setShowModal(true);
    };

    // OPEN EDIT MODAL
    const handleEdit = (user) => {
        setEditUser(user);
        setActiveSection(user.role);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditUser(null);
        setActiveSection(null);
    };


    const handleDelete = async (id) => {
        try {
            await deleteUser(id).unwrap();
            toast("User deleted successfully");
        } catch (err) {
            toast("Failed to delete user");
        }
    };



    if (isLoading) {
        return <div className={styles.loading}>Loading users...</div>;
    }

    return (
        <div className={styles.page}>

            {/* SEARCH */}
            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Caută angajat după nume..."
            />

            {/* ========= MANAGEMENT ========= */}
            <EmployeeSection
                type="management"
                onAddClick={openModal}
                rows={managementUsers}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <EmployeeSection
                type="investigatii"
                onAddClick={openModal}
                rows={investigationsUsers}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <EmployeeSection
                type="auxiliar"
                onAddClick={openModal}
                rows={auxiliaryUsers}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />


            {/* ========= REZUMAT ========= */}
            <SummarySection
                totalEmployees={filteredUsers.length}
                totalMonthlyCost="115 806 RON" // abhi hardcoded
            />

            {/* ========= POPUP COMPONENT ========= */}
            <AddEmployeeModal
                isOpen={showModal}
                sectionKey={activeSection}
                editData={editUser}
                onClose={closeModal}
            />
        </div>
    );
};

export default List;
