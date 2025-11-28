export enum Role {
    SALES = 'sales',
    ADMIN = 'admin',
    MANAGER = 'manager',
    ANALYTICS= 'user'
}

export const DEFAULT_ROLE = Role.USER;

export const allRoles = Object.values(Role);
