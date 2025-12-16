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
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?._id;

// current user ko list se hata do
    const usersWithoutMe = users.filter(u => u._id !== currentUserId);



    // Global search
    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return usersWithoutMe;
        const q = searchTerm.toLowerCase();
        return usersWithoutMe.filter((u) =>
            `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q)
        );
    }, [searchTerm, usersWithoutMe]);

    // ---- ROLE GROUPS (sirf layout ke liye) ----
    const ROLE_TO_SECTION = {
        admin: "management",
        manager: "management",
        analyst: "investigatii",
        sales: "vanzari",
        logistica: "logistica",
        tehnica: "tehnica",
    };



    const TAX_MULTIPLIER = 1.32;

    const totalMonthlyCost = useMemo(() => {
        return filteredUsers.reduce((sum, user) => {
            const salary = Number(user.monthlySalary) || 0;
            const bonus = Number(user.bonus) || 0;

            const bonusWithTax = bonus * TAX_MULTIPLIER;

            return sum + salary + bonusWithTax;
        }, 0);
    }, [filteredUsers]);


    const formatRON = (value) => {
        return new Intl.NumberFormat("ro-RO").format(Math.round(value)) + " RON";
    };




    const openModal = (sectionKey) => {
        setEditUser(null);
        setActiveSection(sectionKey);
        setShowModal(true);
    };

    // OPEN EDIT MODAL
    const handleEdit = (user) => {
        setEditUser(user);
        setActiveSection(ROLE_TO_SECTION[user.role] || null);
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
            toast("Utilizatorul a fost șters cu succes");
        } catch (err) {
            toast("Ștergerea utilizatorului a eșuat");

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
                title="Management"
                onAddClick={openModal}
                rows={filteredUsers.filter(u => u.role === "manager" || u.role === "admin" )}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <EmployeeSection
                type="investigatii"
                title="Investigații"
                onAddClick={openModal}
                rows={filteredUsers.filter(u => u.role === "analyst" )}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <EmployeeSection
                type="auxiliar"
                title="Auxiliar"
                onAddClick={openModal}
                rows={filteredUsers.filter(
                    u => u.role === "user" || u.role === "auxiliar"
                )}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <EmployeeSection
                type="vanzari"
                title="Vânzări"
                onAddClick={openModal}
                rows={filteredUsers.filter(u => u.role === "sales")}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <EmployeeSection
                type="logistica"
                title="Logistică"
                onAddClick={openModal}
                rows={filteredUsers.filter(u => u.role === "logistica")}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <EmployeeSection
                type="tehnica"
                title="Tehnică"
                onAddClick={openModal}
                rows={filteredUsers.filter(u => u.role === "tehnica")}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* ========= REZUMAT ========= */}
            <SummarySection
                totalEmployees={filteredUsers.length}
                totalMonthlyCost={formatRON(totalMonthlyCost)}
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
