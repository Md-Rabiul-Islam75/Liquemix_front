export interface IRegisterUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IDeviceInfo {
  deviceName: string;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
  deviceInfo: IDeviceInfo;
}
