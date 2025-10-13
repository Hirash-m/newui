export class UserDto {
    id!: number;
    fullName!: string;
    username!: string;
    email!: string;
    Password!: string;
    roleIds: number[] = [];
}
  

export interface UserCreateFormData {
    roles: RoleDto[];
//    permissions: PermissionDto[];
}

export interface RoleDto {
    id: number;
    name: string;
}

export interface PermissionDto {
    id: number;
    name: string;
}