export enum Role {
    SALES = 'sales',
    ADMIN = 'admin',
    MANAGER = 'manager',
    ANALYST= 'user',
    EMPLOYEE = 'employee'
}

export const DEFAULT_ROLE = Role.ANALYST;

export const allRoles = Object.values(Role);
