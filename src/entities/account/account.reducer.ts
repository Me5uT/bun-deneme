import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { showToast } from 'app/shared/hooks/showToast';
import { IDashboardDetail } from 'app/shared/model/DashboardModel';
import { IListResponseModel } from 'app/shared/model/ResponseModel';
import { ITenant, ITenantDetail, IUpdateAddon, IUpdateAccount, IUpdateStatus, defaultValue } from 'app/shared/model/tenant.model';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { createSerializedObject } from 'app/shared/util/UtilityService';
import axios from 'axios';

const initialState: EntityState<ITenant | ITenantDetail> = {
  loading: false,
  msspLoading: false,
  partnerLoading: false,
  tenantLoading: false,
  errorMessage: null,
  entities: [],
  msspList: [],
  partnerList: [],
  entity: defaultValue as ITenantDetail,
  entityCount: 0,
  tenant: null as any,
  updating: false,
  updateSuccess: false,
  deleteSuccess: false,
  createSuccess: false,
  accountId: null as string,
};

const apiUrl = 'api/tenants';

// Actions

export const getEntities = createAsyncThunk(
  'tenant/fetch_entity_list',
  async (
    {
      accountId,
      parentAccountId,
      partnerAccountId,
      page,
      size,
      sort,
      searchtext,
      name,
      tenantType,
      tenantStatus,
      licenceType,
      licenceStatus,
      csa,
      expireDateEnd,
      expireDateStart,
    }: IQueryParams,
    thunkAPI: any
  ) => {
    const requestUrl = `${apiUrl}`;

    return axios.get<IListResponseModel>(requestUrl, {
      params: createSerializedObject({
        accountId,
        parentAccountId,
        partnerAccountId,
        page,
        size,
        sort,
        searchtext,
        name,
        tenantType,
        csa,
        tenantStatus,
        licenceType,
        licenceStatus,
        expireDateEnd,
        expireDateStart,
      }),
    });
  }
);

export const getEntity = createAsyncThunk(
  'tenant/fetch_entity',
  async (accountId: string) => {
    const requestUrl = `${apiUrl}/get-detail-overview`;
    return axios.get<ITenant>(requestUrl, {
      params: { accountId },
    });
  },
  { serializeError: serializeAxiosError }
);

export const getMSSP = createAsyncThunk(
  'tenant/fetch_mssp',
  async (searchtext: string) => {
    const requestUrl = `${apiUrl}/search-mssp`;
    return axios.get<ITenant[]>(requestUrl, {
      params: { searchtext },
    });
  },
  { serializeError: serializeAxiosError }
);

export const searchPartner = createAsyncThunk(
  'tenant/searchPartner',
  async (searchtext: string) => {
    const requestUrl = `${apiUrl}/search-partner`;
    return axios.get<any[]>(requestUrl, {
      params: { searchtext },
    });
  },
  { serializeError: serializeAxiosError }
);
export const updatePartner = createAsyncThunk(
  'tenant/update_partner',
  async (entity: { uid: string; partnerId: string }, thunkAPI) => {
    const result = await axios.put<ITenant>(`${apiUrl}/change-partner/${entity.uid}`, {
      partnerId: entity.partnerId,
    });
    thunkAPI.dispatch(getEntity(entity.uid));
    return result;
  },
  { serializeError: serializeAxiosError }
);
export const getTenant = createAsyncThunk(
  'tenant/fetch_tenant',
  async (id: string) => {
    const requestUrl = `${apiUrl}/dashboard/detail`;
    return axios.get<IDashboardDetail>(requestUrl, {
      params: { accountId: id },
    });
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'tenant/create_entity',
  async (entity: ITenant, thunkAPI: any) => {
    const result = await axios.post<ITenant>(apiUrl, cleanEntity(entity));

    thunkAPI.dispatch(
      getEntities({
        accountId: thunkAPI.getState().account?.accountId,
      })
    );
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const resendVerification = createAsyncThunk(
  'tenant/resend_verification',
  async (accountId: string, thunkAPI: any) => {
    const result = await axios.post(`${apiUrl}/resend-verification`, { accountId });

    if (result) return result;
  },
  { serializeError: serializeAxiosError }
);
export const resendSetPassword = createAsyncThunk(
  'tenant/reset_password',
  async (accountId: string, thunkAPI: any) => {
    const result = await axios.post(`${apiUrl}/resend-change-password`, { accountId });

    return result;
  },
  { serializeError: serializeAxiosError }
);
export const updateEntity = createAsyncThunk(
  'tenant/update_entity1',
  async (entity: ITenant, thunkAPI) => {
    const result = await axios.put<ITenant>(`${apiUrl}/${entity.id}`, cleanEntity(entity));

    return result;
  },
  { serializeError: serializeAxiosError }
);
export const updateEntityLicence = createAsyncThunk(
  'tenant/update_entity_licence',
  async (entity: IUpdateAccount, thunkAPI) => {
    const result = await axios.post<IUpdateAccount>(`${apiUrl}/update-licence`, cleanEntity(entity));
    thunkAPI.dispatch(getEntity(entity?.accountId));
    return result;
  },
  { serializeError: serializeAxiosError }
);
export const updateEntityAddon = createAsyncThunk(
  'tenant/update_entity_csa',
  async (entity: IUpdateAccount, thunkAPI) => {
    const result = await axios.post<IUpdateAddon>(`${apiUrl}/update-addon`, cleanEntity(entity));
    // thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);
export const changeEntityStatus = createAsyncThunk(
  'tenant/change_entity_status',
  async (entity: IUpdateStatus, thunkAPI) => {
    const result = await axios.put(`${apiUrl}/change-status/${entity.accountId}`, { status: entity.status });
    thunkAPI.dispatch(getEntity(entity.accountId));
    return result;
  },
  { serializeError: serializeAxiosError }
);
export const changeEntityOwner = createAsyncThunk(
  'tenant/change_entity_owner',
  async (entity: any, thunkAPI) => {
    const result = await axios.put(`${apiUrl}/change-owner/${entity.accountId}`, { mail: entity.mail });
    // thunkAPI.dispatch(getEntity(entity.accountId));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'tenant/delete_entity',
  async ({ id, mirketToken, accountId, onDetail }: any, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete(requestUrl, { data: { mirketToken } });

    if (!onDetail) {
      thunkAPI.dispatch(
        getEntities({
          accountId,
        })
      );
    }
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const TenantSlice = createEntitySlice({
  name: 'tenant',
  initialState,
  reducers: {
    resetErrorMessage(state) {
      return { ...state, errorMessage: null };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(getTenant.fulfilled, (state, action) => {
        state.tenantLoading = false;
        state.tenant = action.payload.data as any;
      })
      .addCase(deleteEntity.fulfilled, state => {
        showToast('Account Deleted Successfully.');

        state.loading = false;
        state.deleteSuccess = true;
        state.entity = {};
      })
      .addCase(resendVerification.fulfilled, state => {
        showToast('Resend Verification email has been sent.');
        state.sendVerificationLoading = false;
      })
      .addCase(resendSetPassword.fulfilled, state => {
        showToast('Set Password email has been sent.');
        state.sendVerificationLoading = false;
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entity: {},
          accountId: action.meta.arg.accountId,
          loading: false,
          entities: data.resultList,
          entityCount: data.totalCount,
        };
      })
      .addMatcher(isFulfilled(getMSSP), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          msspLoading: false,
          msspList: data,
        };
      })
      .addMatcher(isFulfilled(searchPartner), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          partnerLoading: false,
          partnerList: data,
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity), (state, action) => {
        showToast('Account Created Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(updateEntityLicence, updateEntityAddon, changeEntityStatus, changeEntityOwner), (state, action) => {
        showToast('Account Updated Successfully.');

        state.updating = false;
        state.loading = false;
        state.errorMessage = '';
        state.updateSuccess = true;
      })

      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(getMSSP), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.msspLoading = true;
      })
      .addMatcher(isPending(searchPartner), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.partnerLoading = true;
      })
      .addMatcher(isPending(getTenant), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.tenantLoading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, changeEntityOwner, updateEntityLicence, updateEntityAddon), state => {
        state.errorMessage = null;
        state.deleteSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(changeEntityStatus, resendVerification, resendSetPassword, deleteEntity), state => {
        state.errorMessage = null;
        state.deleteSuccess = false;
        state.sendVerificationLoading = true;
      })
      .addMatcher(isRejected(getEntities, getEntity, getTenant, createEntity, getMSSP, searchPartner), (state, action) => {
        showToast(action.error.message, { type: 'error' });

        state.loading = false;
        state.tenantLoading = false;
        state.updating = false;
        state.updateSuccess = false;
        state.deleteSuccess = false;
        state.msspLoading = false;
        state.partnerLoading = false;
        state.errorMessage = action.error.message;
      })
      .addMatcher(
        isRejected(
          changeEntityStatus,
          changeEntityOwner,
          updateEntity,
          resendVerification,
          resendSetPassword,
          deleteEntity,
          updateEntityLicence,
          updateEntityAddon
        ),
        (state, action) => {
          showToast(action.error.message, { type: 'error' });
          state.loading = false;
          state.tenantLoading = false;
          state.updating = false;
          state.updateSuccess = false;
          state.deleteSuccess = false;
          state.msspLoading = false;
          state.partnerLoading = false;
          state.sendVerificationLoading = false;
          state.errorMessage = action.error.message;
        }
      );
  },
});

export const { reset, resetErrorMessage } = TenantSlice.actions;

// Reducer
export default TenantSlice.reducer;
