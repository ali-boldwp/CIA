export enum Role {
    SALES = 'sales',
    ADMIN = 'admin',
    MANAGER = 'manager',
    ANALYST= 'analyst',
    EMPLOYEE = 'user'
}

export const DEFAULT_ROLE = Role.EMPLOYEE;

export const allRoles = Object.values(Role);
