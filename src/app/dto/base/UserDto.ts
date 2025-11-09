export class UserDto {
    id!: number;
    fullName!: string;
    username!: string;
    email!: string;
    Password: string = "";
    profilePictureUrl?: string;     // جدید
  status!: UserStatus;            // جدید
  lastSeen?: string;
    roleIds: number[] = [];
}


export enum UserStatus {
  Offline = 1,
  Inactive = 2,
  Online = 3
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
