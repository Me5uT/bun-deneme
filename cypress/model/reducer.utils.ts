import { IDashboardDetail } from "../model/DashboardModel";
import {
  IRadiusClientDetailModel,
  LDAPGatewayDownloadOption,
  RadiusGatewayDownloadOption,
} from "../model/gateway.model";
import { RadiusRuleAction } from "../model/RadiusRulesModel";
import { IRequestTenantSettings } from "../model/tenant-setting.model";
import { ITenant, ITenantDetail, StatusInt } from "../model/tenant.model";

export enum SortType {
  ASC = "ASC",
  DESC = "DESC",
}
export interface IPaginationParams {
  pageNumber: 0;
  pageSize: 0;
  sortColumn: string;
  sortDirection: string;
}

export type IQueryParams = {
  uid?: string;
  level?: number;
  message?: string;
  pagination?: IPaginationParams;
  user?: string;
  query?: string;
  page?: number;
  size?: number;
  sort?: string;
  sortDirection?: SortType;
  name?: string;
  radiusGatewayDownloadOption?: RadiusGatewayDownloadOption;
  ldapGatewayDownloadOption?: LDAPGatewayDownloadOption;
  displayName?: string;
  username?: string;
  sam?: string;
  samName?: string;
  mail?: string;
  phone?: string;
  status?: StatusInt;
  isAccept?: boolean;
  isLocked?: boolean;
  isActive?: boolean;
  verificationStatus?: any;
  participantGroupUids?: string;
  participantStatus?: any;
  participantType?: number; // User Type
  participantid?: string;
  radiusRuleId?: string;
  externalSourceId?: string;
  gatewayId?: string;
  ldapGroup?: string[];
  group?: string[] | string;
  multiRegister?: boolean;
  isExternal?: boolean;
  tenantType?: number;
  tenantStatus?: number;
  licenceType?: number;
  licenceStatus?: number;
  expireDateStart?: number;
  expireDateEnd?: number;
  csa?: boolean;
  client?: string;
  action?: RadiusRuleAction;
  searchtext?: string;
  accountId?: string;
  adminId?: string;
  groupId?: string;
  parentAccountId?: string;
  partnerAccountId?: string;
  exceptParticipantGroupUid?: string;
  exceptparticipantid?: string;
};

export const enum EProgress {
  none,
  pending,
  success,
  failed,
}
export interface EntityState<T> {
  progress?: EProgress;
  isAuthenticated?: boolean;
  checkedUsername?: boolean;
  dashboardTopUserLoading?: boolean;
  dashboardGraphicLoading?: boolean;
  sendVerificationLoading?: boolean;
  checkedClientName?: boolean;
  syncExternalSourceLoading?: boolean;
  isExcept?: boolean;
  isAllParticipantsIncluded?: boolean;
  loading: boolean;
  detailLoading?: boolean;
  msspLoading?: boolean;
  partnerLoading?: boolean;
  tenantLoading?: boolean;
  searchLoading?: boolean;
  checkLoading?: boolean;
  clientLoading?: boolean;
  externalSourceLoading?: boolean;
  dashboardDetailLoading?: boolean;
  dashboardMostParticipantLoading?: boolean;
  downloadRadiusGatewayLoading?: boolean;
  checkStatus?: boolean | null;
  authorizationAttributeTypesLoading?: boolean;
  groupByParticipantLoading?: boolean;
  groupByRuleLoading?: boolean;
  participantBySelectionLoading?: boolean;
  participantExceptSelectionLoading?: boolean;
  participantByGroupLoading?: boolean;
  participantByRuleLoading?: boolean;
  participantExpectGroupLoading?: boolean;
  participantExpectRuleLoading?: boolean;
  groupExpectParticipantLoading?: boolean;
  groupExpectRuleLoading?: boolean;
  participantGroupLoading?: boolean;
  radiusConfigSTR?: string;
  externalSourceExceptGroupLoading?: boolean;
  externalSourceByGroupLoading?: boolean;
  externalSourceReportLoading?: boolean;
  externalSourceReports?: any[];
  participantGroupList?: any[];
  participantExceptSelectionList?: any[];
  participantBySelectionList?: any[];
  externalSourceExceptGroupList?: any[];
  externalSourceByGroupList?: any[];
  attributeProfileList?: any[];
  manageList?: any[];
  remoteSupportLoading?: boolean;
  errorMessage: string | null;
  verfiyErrorMessage?: string | null;
  checkErrorMessage?: string | null;
  partnerList?: any[];
  msspList?: any[];
  groupList?: any[];
  externalSourceList?: any[];
  gatewayRadiusList?: any[];
  gatewayLdapList?: any[];
  clientList?: any[];
  clientListByGateway?: any[];
  clientDetail?: IRadiusClientDetailModel;
  groupLoading?: boolean;
  groupCount?: number;
  groupByParticipantList?: any[];
  groupByRuleList?: any[];
  participantByRuleList?: any[];
  participantByGroupList?: any[];
  participantBySelectionCount?: number;
  participantExceptSelectionCount?: number;
  participantByRuleCount?: number;
  participantByGroupCount?: number;
  dashboardTopUsers?: any[];
  dashboardGraphic?: any[];
  groupExceptParticipantList?: any[];
  groupExceptRuleList?: any[];
  participantExceptGroupList?: any[];
  participantExceptRuleList?: any[];
  splitedSmsProviderList?: any[];
  participantExceptGroupCount?: number;
  participantExceptRuleCount?: number;
  timezones?: any[];
  phoneCountryCodes?: any[];
  authorizationAttributeTypes?: any[];
  logMessages?: { label: string; value: string }[];
  logTypes?: { label: string; value: string }[];
  logEndUserIPs?: { label: string; value: string }[];
  loglookupLoading?: boolean;
  tenantSettings?: IRequestTenantSettings;
  entities?: ReadonlyArray<T>;
  entity?: T;
  dashboardDetail?: IDashboardDetail;
  entityCount?: number;
  entityCountGroup?: number;
  entityParticipantGroupCount?: number;
  externalSourceCount?: number;
  tenant?: ITenantDetail | ITenant;
  accountId?: string | null;
  links?: any;
  updating?: boolean;
  totalItems?: number;
  updateSuccess?: boolean;
  deleteSuccess?: boolean;
  createSuccess?: boolean;
  exportedItemsBase64Value?: string;
  canChangePassword?: boolean | null;
  isChangedPassword?: boolean | null;
  isResetPassword?: boolean | null;
  verifyUrl?: string | null;
  enableMfaMethods?: any;
}
