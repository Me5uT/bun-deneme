export interface ITenantSetting {
  uid: string;
  key?: string;
  value: string;
}

export interface IUpdateTenantSettings {
  accountId: string;
  settings: ITenantSetting[];
}
export interface IChangePasswordModel {
  passwordToken: string;
  mirketToken: string;
  password: string;
  recordType: ERecordType;
}

export interface ICheckChangePasswordRequestModel {
  passwordtoken: string;
  recordtype: string | number;
}

export interface IRequestTenantSettings {
  companyName: string;
  adminSetPasswordTimeoutTime: string | number;
  adminVerificationTimeoutTime: string | number;
  userSetPasswordTimeoutTime: string | number;
  userVerificationTimeoutTime: string | number;
  bruteForceProtectionTime: string | number;
  language: string;
  timeZone: string;
  phoneCountryCode: string;
  passwordPolicyRegex: any; // string | number[];
  enableCsaDetectionNotification: boolean;
  agentAndGatewayStatusNotification: boolean;
  status: boolean;
  ipAddress: string;
  port: string;
  messageFormat: string;
  defaultOtpProvider: string; // in provider list
  manuelProvision: boolean;
  passwordPolicyMinChar?: string;
  regex1?: boolean;
  regex2?: boolean;
}
export enum ERecordType {
  PortalAdmin,
  Participant,
}

export interface IResetPasswordModel {
  uid: string;
  recordType: ERecordType;
}
