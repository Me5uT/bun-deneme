import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import axios from 'axios';

import { IGateway, LDAPGatewayDownloadOption } from 'app/shared/model/gateway.model';
import { IListResponseModel } from 'app/shared/model/ResponseModel';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { base64ToString, downloadBase64AsJsonFile, downloadBase64AsZipFile, downloadJsonFile } from 'app/shared/util/ExportAndDownload';
import { showToast } from 'app/shared/hooks/showToast';

const initialState: EntityState<IGateway> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {},
  updating: false,
  updateSuccess: false,
  radiusConfigSTR: '',
  downloadRadiusGatewayLoading: false,
  gatewayLdapList: [],
};

const apiUrl = 'api/gateway';

// Actions

export const getEntities = createAsyncThunk(
  'gateway-ldap/fetch_entity_list',
  async ({ searchtext, accountId }: IQueryParams, thunkAPI: any) => {
    return axios.get<IListResponseModel>(`${apiUrl}/ldap`, { params: { accountId, searchtext } });
  }
);

export const getEntity = createAsyncThunk(
  'gateway-ldap/fetch_entity',
  async ({ uid, accountId }: any, thunkAPI: any) => {
    return axios.get<IGateway>(`${apiUrl}/ldap/get-detail`, { params: { uid, accountId } });
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'gateway-ldap/create_entity',
  async (entity: IGateway, thunkAPI) => {
    const result = await axios.post<IGateway>(`${apiUrl}/ldap`, cleanEntity(entity));
    thunkAPI.dispatch(
      getEntities({
        accountId: entity?.accountId,
      })
    );
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'gateway-ldap/update_entity',
  async (entity: IGateway, thunkAPI) => {
    const { uid, accountId, ...data } = entity;

    const result = await axios.put<IGateway>(`${apiUrl}/ldap/edit/${uid}`, data);

    thunkAPI.dispatch(getEntity({ uid, accountId }));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'gateway-ldap/delete_entity',
  async ({ uid, accountId, onDetail }: any, thunkAPI) => {
    const result = await axios.delete(`${apiUrl}/${uid}`);

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

// export const downloadLDAPGateway = createAsyncThunk(
//   'radius/download',
//   async ({ uid, ldapGatewayDownloadOption }: IQueryParams, thunkAPI: any) => {
//     const result = await axios.get<any>(`${apiUrl}/ldap/download`, {
//       params: { uid, option: ldapGatewayDownloadOption },
//       responseType: 'text',
//     });

//     if (result.data && ldapGatewayDownloadOption === LDAPGatewayDownloadOption.FULL) {
//       downloadBase64AsZipFile(result.data, 'ldap-gateway');
//     } else if (result.data && ldapGatewayDownloadOption === LDAPGatewayDownloadOption.CONFIG) {
//       downloadBase64AsZipFile(result.data, 'ldap-gateway-config');
//     } else throw new Error('Can not download!');
//   },
//   { serializeError: serializeAxiosError }
// );

export const downloadLDAPGateway = createAsyncThunk(
  'radius/download',
  async ({ uid, ldapGatewayDownloadOption }: IQueryParams, thunkAPI: any) => {
    const result = await axios.get<any>(`${apiUrl}/ldap/download`, {
      params: { uid, option: ldapGatewayDownloadOption },
      responseType: 'text',
    });
    console.log('🚀 ~ result:', result);

    if (result.data) downloadJsonFile(result.data, 'config');

    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const GatewaySlice = createEntitySlice({
  name: 'gatewayLdap',
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
      .addCase(deleteEntity.fulfilled, state => {
        showToast('LDAP Gateway Deleted Successfully.');

        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
        state.loading = false;
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entity: {},
          accountId: action.meta.arg.accountId,
          loading: false,
          gatewayLdapList: data.resultList,
        };
      })
      .addMatcher(isFulfilled(updateEntity), (state, action) => {
        showToast('LDAP Gateway Updated Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(createEntity), (state, action) => {
        showToast('LDAP Gateway Created Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(downloadLDAPGateway), (state, action) => {
        state.downloadRadiusGatewayLoading = false;
        state.radiusConfigSTR = JSON.stringify(action?.payload?.data, null, 2); // base64ToString(action?.payload?.data);
      })
      .addMatcher(isPending(downloadLDAPGateway), state => {
        state.errorMessage = null;
        state.downloadRadiusGatewayLoading = true;
        state.radiusConfigSTR = '';
      })
      .addMatcher(isPending(getEntities, getEntity, createEntity, updateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.loading = true;
      })
      .addMatcher(isRejected(getEntities, downloadLDAPGateway, getEntity, createEntity, deleteEntity, updateEntity), (state, action) => {
        showToast(action.error.message, { type: 'error' });

        state.loading = false;
        state.updating = false;
        state.updateSuccess = false;
        state.downloadRadiusGatewayLoading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset, resetErrorMessage } = GatewaySlice.actions;

// Reducer
export default GatewaySlice.reducer;
