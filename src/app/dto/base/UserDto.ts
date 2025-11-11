export class UserDto {
  id!: number;
  fullName!: string;
  username!: string;
  email!: string;
  Password: string = "";
  profilePicture?: File | null;  // تغییر به File
  status!: UserStatus;
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
