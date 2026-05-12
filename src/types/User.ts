export interface IUserRole {
  id: number;
  name: string;
}
export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
  avatar?: string;
  specialistId?: number | null;
  specialistCategoryId?: number | null;
  specialistAccountReviewStatus?: string;
  roles?: IUserRole[];
}

export interface ICustomPhoneInputData {
  name: string;
  dialCode: string;
  countryCode: string;
  format?: string;
}
