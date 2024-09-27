import { ILicenceHistory } from './licence-history.model';
import { TenantStatusInt, TenantTypeInt } from './tenant.model';
import { IVersion } from './version.model';

export interface IDashboardDetail {
  licenceHistory: ILicenceHistory;
  tenant: {
    id: number;
    uid: string;
    isActive: boolean;
    isDeleted: boolean;
    createdOn: null | string;
    createdDate: string;
    updatedOn: null | string;
    updatedDate: null | Date;
    parentId: string;
    name: string;
    alias: string;
    tenantType: number | TenantTypeInt;
    domain: string;
    tenantStatus: number | TenantStatusInt;
    isSupportActive: boolean;
    version: IVersion | null;
  };
  portal: {
    adminCount: number;
    totalGatewayCount: number;
    onlineGatewayCount: number;
    pendingParticipantCount: number;
    totalParticipantCount: number;
    totalGroupCount: number;
  };
  timezone: string;
}

export interface IDashboardMostParticipants {
  participantCounts: {
    username: string;
    count: number;
  }[];
}
