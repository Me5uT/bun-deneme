import { ITenant, VerificationStatusInt } from "./tenant.model";
import { IQueryParams } from "./reducer.utils";
import { EGroupType, TransferActions } from "./GroupModel";

export interface IParticipant {
  id?: number;
  uid?: string;
  accountId?: string | null;
  displayName?: string | null;
  username?: string | null;
  phone?: string | null;
  sam?: string | null;
  samName?: string | null;
  mail?: string | null;
  isExternal?: boolean | null;
  participantType?: number | null;
  participantStatus?: ParticipantStatusInt | null;
  password?: string | null;
  verificationStatus?: number | null;
  isChangePassword?: boolean | null;
  changePasswordDate?: string | null;
  changePasswordToken?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
  createdOn?: number | null;
  createdDate?: string | null;
  updatedOn?: number | null;
  updatedDate?: string | null;
  tenant?: ITenant | null;

  groups?: string[] | null; // check
  searchParams?: IQueryParams;
}

export interface IParticipantByGroupModel {
  groupId: string;
  isExcept: boolean;
  page?: number;
  size?: number;
  searchtext: string;
}
export interface IParticipantByRuleModel {
  ruleId: string;
  isExcept: boolean;
  page: number;
  size: number;
  searchtext: string;
}
export interface IParticipantBySelectionModel {
  accountId: string;
  exceptParticipants: string;
  page: number;
  searchtext: string;
}

export interface IParticipantDetail {
  id?: number;
  uid?: string;
  displayName?: string | null;
  isExternal?: boolean | null;
  participantType?: ParticipantTypeInt | null;
  phone?: string | null;
  sam?: string | null;
  username?: string | null;
  participantStatus?: ParticipantStatusInt;
  verificationStatus?: VerificationStatusInt | null;
  isActive?: boolean;
  mail?: string | null;
  externalSources?:
    | {
        gatewayName: null | string;
        gatewayUid: null | string;
        groupType: EGroupType;
        name: string;
        totalParticipant: null | number;
        uid: string;
        validParticipant: null | number;
      }[]
    | null;
  participantGroups?:
    | {
        groupType: EGroupType;
        name: string;
        totalParticipant: null | number;
        uid: string;
      }[]
    | null;
  participantMails?: IParticipantMails[] | null;
}
export interface IParticipantDrawerDetail {
  displayName: string;
  id: number;
  isExternal: boolean;
  mail: string | null;
  participantType: ParticipantTypeInt;
  phone: string;
  sam: string;
  uid: string;
  username: string;
  verificationStatus: VerificationStatusInt;
}

export enum ParticipantStatusInt {
  Active,
  Syncing,
  Passive,
  Lock,
}

export enum ParticipantTypeInt {
  Local,
  LDAP,
  ALL,
}

export interface IUpdateParticipantStatus {
  uid: string;
  status: boolean;
  accountId: string;
}
export interface IParticipantTestSenderRequestModel {
  userId: string;
  senderType: SenderTypeInt; // 0: SMS, 1: MIRKETOTP, 2: MIRKETPUSH, 3: MAIL
}

export enum SenderType {
  SMS = "SMS",
  MIRKETOTP = "MIRKET OTP",
  MIRKETPUSH = "MIRKET PUSH",
  MAIL = "MAIL",
}

export enum SenderTypeInt {
  SMS,
  MIRKETOTP,
  MIRKETPUSH,
  MAIL,
}

export interface IEditParticipantGroups {
  accountId: string;
  participantId: string;
  participantGroups: IParticipantGroups[];
}
export interface IParticipantGroups {
  participantGroupId: string;
  action: TransferActions;
}
export interface IParticipantMails {
  uid: string;
  mail: string;
  mailType: IParticipantMailType;
  verifyStatus: IVerifyStatus;
  isActive: boolean;
}

export enum IVerifyStatus {
  ACTIVATED,
  PENDING,
  REJECTED,
}
export enum IParticipantMailType {
  MAIN,
  OTHER,
}

export interface IDeleteParticipants {
  uids: string[];
  accountId: string;
  searchData: IQueryParams;
}
export const defaultValue: Readonly<IParticipant> = {
  isExternal: false,
  isChangePassword: false,
  isActive: false,
  isDeleted: false,
};
