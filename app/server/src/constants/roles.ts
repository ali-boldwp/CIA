export enum Role {
    SUPERADMIN = "superAdmin",
    ADMIN = "admin",
    MANAGER = "manager",
    ANALYST = "analyst",
    EMPLOYEE = "user",
    VANZARI = "sales",
    LOGISTICA = "logistica",
    TEHNICA = "tehnica",

}

export const DEFAULT_ROLE = Role.EMPLOYEE;

export const allRoles = Object.values(Role);
