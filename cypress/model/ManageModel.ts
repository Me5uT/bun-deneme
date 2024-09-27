export interface IManageListModel {
  uid: string;
  category?: ManageCategory;
  detection?: string;
  detectionNumber?: string;
  detectionExplanation?: string;
  subCondition?: SubCondition;
  phases?: number;
  lastDetect?: string;
  excludeUsers?: string[];
  excludeIPs?: string[];
  testInput?: string[];
  certaincyScore?: number;
  threatScore?: number;
  status?: boolean;
}

export interface IManageDetailModel {
  uid: string;
  category?: ManageCategory;
  detection?: string;
  lastDetect?: string;
  excludeIPs?: string[];
  excludeUsers?: string[];
  testInput?: string[];
  certaincyScore?: number;
  threatScore?: number;
  status?: boolean;
}
export enum SubCondition {
  UNKNOWN_USER = 'Unknown User',
  FIRST_FACTOR_FAILED = 'First Factor Failed',
  SECOND_FACTOR_FAILED = 'Second Factor Failed',
  AUTHENTICATION_SUCCESSFULL = 'Authentication Successfull',
}
export enum ManageCategory {
  Credential_Harvesting,
  Credential_Stuffing,
  Account_Takeover,
}
export enum ManageCategoryStr {
  Credential_Harvesting = 'Credential Harvesting',
  Credential_Stuffing = 'Credential Stuffing',
  Account_Takeover = 'Account Takeover',
}
