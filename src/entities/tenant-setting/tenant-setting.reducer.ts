import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import axios from 'axios';

import { IRequestTenantSettings, ITenantSetting, IUpdateTenantSettings } from 'app/shared/model/tenant-setting.model';
import { IUpdateStatus } from 'app/shared/model/tenant.model';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { convertArrayToObject } from 'app/shared/util/UtilityService';
import { getDashboardDetail } from '../dashboard/dashboard.reducer';
import { showToast } from 'app/shared/hooks/showToast';

const initialState: EntityState<ITenantSetting> = {
  loading: false,
  errorMessage: null,
  verfiyErrorMessage: null,
  entities: [] as any,
  entity: null,
  tenantSettings: null,
  timezones: [],
  phoneCountryCodes: [],
  updating: false,
  updateSuccess: false,
  verifyUrl: null,
};

const apiUrl = 'api/tenant-settings';

// Actions

export const getEntities = createAsyncThunk(
  'tenantSetting/fetch_entity_list',
  async ({ accountId }: IQueryParams) => {
    return axios.get<ITenantSetting[]>(`${apiUrl}`, {
      params: {
        accountId,
      },
    });
  },
  { serializeError: serializeAxiosError }
);

export const updateGeneralSettings = createAsyncThunk(
  'tenantSetting/update_entity',
  async (entity: IUpdateTenantSettings, thunkAPI) => {
    const result = await axios.post<any>(`${apiUrl}`, entity);
    thunkAPI.dispatch(
      getEntities({
        accountId: entity.accountId,
      })
    );
    return result;
  },
  { serializeError: serializeAxiosError }
);
export const updateSyslog = createAsyncThunk(
  'tenantSetting/update_syslog_entity',
  async (entity: IUpdateTenantSettings, thunkAPI) => {
    const result = await axios.post<any>(`${apiUrl}/syslog`, entity);
    thunkAPI.dispatch(
      getEntities({
        accountId: entity.accountId,
      })
    );
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const getTimeZones = createAsyncThunk(
  'tenantSetting/fetch_timezones',
  async () => {
    return axios.get<any[]>(`${apiUrl}/time-zones`);
  },
  { serializeError: serializeAxiosError }
);
export const getPhoneCountryCodes = createAsyncThunk(
  'tenantSetting/fetch_phonecodes',
  async () => {
    return axios.get<any[]>(`${apiUrl}/phone-countries`);
  },
  { serializeError: serializeAxiosError }
);

export const changeRemoteSupportStatus = createAsyncThunk(
  'tenant/change_entity_status',
  async (entity: IUpdateStatus, thunkAPI) => {
    const result = await axios.put(`api/tenants/change-support-status/${entity.accountId}`, { status: entity.status });
    thunkAPI.dispatch(getDashboardDetail(entity.accountId));

    if (result && entity.status) showToast('Remote support has been turned on.');
    if (result && !entity.status) showToast('Remote support has been turned off.');

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const checkVerify = createAsyncThunk(
  'tenantsetting/check-verify',
  async ({ id, recordtype }: any, thunkAPI: any) => {
    return axios.get<any>(`${apiUrl}/get-verification-url`, {
      params: { id, recordtype },
    });
  },
  { serializeError: serializeAxiosError }
);

// slice

export const TenantSettingSlice = createEntitySlice({
  name: 'tenantSetting',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;
        const tenantSettings: IRequestTenantSettings = convertArrayToObject(data);

        return {
          ...state,
          loading: false,
          updateSuccess: true,
          tenantSettings,
          entities: data,
        };
      })
      .addMatcher(isFulfilled(updateGeneralSettings, updateSyslog), (state, action) => {
        showToast('Settings updated successfully.');
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(changeRemoteSupportStatus), (state, action) => {
        showToast('Remote support status updated successfully.');
        state.remoteSupportLoading = false;
      })
      .addMatcher(isFulfilled(getTimeZones), (state, action) => {
        state.timezones = action.payload.data;
      })
      .addMatcher(isFulfilled(getPhoneCountryCodes), (state, action) => {
        state.phoneCountryCodes = action.payload.data;
      })
      .addMatcher(isFulfilled(checkVerify), (state, action) => ({
        ...state,
        loading: false,
        verifyUrl: action.payload.data,
      }))
      .addMatcher(isPending(getEntities, updateGeneralSettings, updateSyslog, checkVerify), state => {
        state.verfiyErrorMessage = null;
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(changeRemoteSupportStatus), state => {
        state.errorMessage = null;
        state.remoteSupportLoading = true;
      })
      .addMatcher(isRejected(changeRemoteSupportStatus), (state, action) => {
        showToast(action.error.message, { type: 'error' });

        state.remoteSupportLoading = false;
        state.errorMessage = action.error.message;
      })
      .addMatcher(isRejected(getEntities, updateGeneralSettings, updateSyslog, checkVerify), (state, action) => {
        showToast(action.error.message, { type: 'error' });

        state.loading = false;
        state.updating = false;
        state.verifyUrl = null;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
        state.verfiyErrorMessage = action.error.message;
      });
  },
});

export const { reset } = TenantSettingSlice.actions;

// Reducer
export default TenantSettingSlice.reducer;
