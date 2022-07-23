import { Technology } from './technology.interface';
import { UserType } from './user-type.interface';

export interface Merchant {
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

export interface MerchantAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredIn?: number;
  data?: any;
  message?: string;
}

export interface MerchantJwtPayload {
  _id?: string;
  username: string;
}
