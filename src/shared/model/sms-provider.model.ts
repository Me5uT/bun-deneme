export interface ISmsProviderListModel {
  uid: string;
  name: string;
  description: string;
  url: string;
  tokenUrl: string;
  username: string;
  originator: string;
  message: string;
  companySignature: string;
  userCode: string;
  accountCode: string;
  provider: number; // enum
}

export interface ISmsProviderAddRequestModel {
  accountId: string;
  name: string; //
  description: string; //
  username: string; //
  password: string; //
  originator: string; //
  message: string; //
  companySignature: string; //
  userCode: string; //
  accountCode: string; //
  provider: number; // enum //
}

export interface ISmsProviderDetailModel {
  uid: string;
  name: string;
  description: string;
  username: string;
  password: string;
  originator: string;
  message: string;
  companySignature: string;
  userCode: string;
  accountCode: string;
  provider: number; // enum
}

export interface ISmsProviderUpdateRequestModel {
  uid: string;
  name: string;
  description: string;
  username: string;
  password: string;
  originator: string;
  message: string;
  companySignature: string;
  userCode: string;
  accountCode: string;
  provider: number; // enum
}
