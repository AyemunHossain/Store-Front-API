import { Technology } from './technology.interface';
import { UserType } from './user-type.interface';

export interface User {
  _id?: string;
  name?: string;
  username?: string;
  phoneNo?: string;
  email?: string;
  password?: string;
  gender?: string;
  profileImg?: string;
  joinDate?: string;
  userType?: UserType;
  designation?: any;
  technologies?: Technology[];
  hasAccess?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredIn?: number;
  data?: any;
  message?: string;
}

export interface UserJwtPayload {
  _id?: string;
  username: string;
}
