import { IUserRole } from "@/types/User";

export const getDashboardPath = (_roles: IUserRole[]): string => {
  // Since we only have login/registration, just return home
  return "/";
};
