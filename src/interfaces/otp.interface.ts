export interface Otp {
    _id?: string;
    phoneNo?: string;
    code?: string;
    count?: number;
    expireTime?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    success?: boolean
}
