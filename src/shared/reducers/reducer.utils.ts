import {
  ActionReducerMapBuilder,
  AnyAction,
  AsyncThunk,
  SerializedError,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
  createSlice,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { RadiusRuleAction } from '../model/RadiusRulesModel';
import { IRequestTenantSettings } from '../model/tenant-setting.model';
import { ITenant, ITenantDetail, StatusInt } from '../model/tenant.model';
import { IDashboardDetail } from '../model/DashboardModel';
import { IRadiusClientDetailModel, LDAPGatewayDownloadOption, RadiusGatewayDownloadOption } from '../model/gateway.model';
import { ParticipantStatusInt } from '../model/participant.model';
import { MFAMethods } from '../model/SSPModels';

export enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
}
export interface IPaginationParams {
  pageNumber: 0;
  pageSize: 0;
  sortColumn: string;
  sortDirection: string;
}
/**
 * Model for redux actions with pagination
 */
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

/**
 * Useful types for working with actions
 */
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;
export type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

/**
 * Check if the async action type is rejected
 */
export function isRejectedAction(action: AnyAction) {
  return action.type.endsWith('/rejected');
}

/**
 * Check if the async action type is pending
 */
export function isPendingAction(action: AnyAction) {
  return action.type.endsWith('/pending');
}

/**
 * Check if the async action type is completed
 */
export function isFulfilledAction(action: AnyAction) {
  return action.type.endsWith('/fulfilled');
}

const commonErrorProperties: Array<keyof SerializedError> = ['name', 'message', 'stack', 'code'];

/**
 * serialize function used for async action errors,
 * since the default function from Redux Toolkit strips useful info from axios errors
 */
export const serializeAxiosError = (value: any): AxiosError | SerializedError => {
  // if (typeof value === 'object' && value !== null) {
  //   // if (value.isAxiosError) {
  //   console.log('serializeAxiosError', value?.response?.data?.title);

  //   return value?.response?.data?.title;
  //   // } else {
  //   //   const simpleError: SerializedError = {};
  //   //   for (const property of commonErrorProperties) {
  //   //     if (typeof value[property] === 'string') {
  //   //       simpleError[property] = value[property];
  //   //     }
  //   //   }

  //   //   return simpleError;
  //   // }
  // }
  // return value.response.data.title;
  return { message: value?.response?.data?.title };
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

/**
 * A wrapper on top of createSlice from Redux Toolkit to extract
 * common reducers and matchers used by entities
 */
export const createEntitySlice = <T, Reducers extends SliceCaseReducers<EntityState<T>>>({
  name = '',
  initialState,
  reducers,
  extraReducers,
  skipRejectionHandling,
}: {
  name: string;
  initialState: EntityState<T>;
  reducers?: ValidateSliceCaseReducers<EntityState<T>, Reducers>;
  extraReducers?: (builder: ActionReducerMapBuilder<EntityState<T>>) => void;
  skipRejectionHandling?: boolean;
}) => {
  return createSlice({
    name,
    initialState,
    reducers: {
      /**
       * Reset the entity state to initial state
       */
      reset() {
        return initialState;
      },
      ...reducers,
    },
    extraReducers(builder) {
      extraReducers(builder);
      /*
       * Common rejection logic is handled here.
       * If you want to add your own rejcetion logic, pass `skipRejectionHandling: true`
       * while calling `createEntitySlice`
       * */
      if (!skipRejectionHandling) {
        builder.addMatcher(isRejectedAction, (state, action) => {
          state.loading = false;
          state.updating = false;
          state.updateSuccess = false;
          state.errorMessage = action.error.message;
        });
      }
    },
  });
};
