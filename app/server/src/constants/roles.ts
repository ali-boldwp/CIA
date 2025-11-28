export enum Role {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    MANAGER = 'manager',
    USER = 'user'
}

export const DEFAULT_ROLE = Role.USER;

export const allRoles = Object.values(Role);
