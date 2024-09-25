import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import {
  IGateway,
  IRadiusClientCreateModel,
  IRadiusClientDetailModel,
  IRadiusClientUpdateModel,
  RadiusGatewayDownloadOption,
  defaultValue,
} from 'app/shared/model/gateway.model';
import { IListResponseModel } from 'app/shared/model/ResponseModel';
import { downloadBase64AsZipFile, downloadJsonFile } from 'app/shared/util/ExportAndDownload';
import { showToast } from 'app/shared/hooks/showToast';

const initialState: EntityState<IGateway> = {
  loading: false,
  checkLoading: false,
  downloadRadiusGatewayLoading: false,
  clientLoading: false,
  checkedClientName: null,
  errorMessage: null,
  entities: [],
  clientList: [],
  clientListByGateway: [],
  entity: {},
  clientDetail: {} as IRadiusClientDetailModel,
  updating: false,
  updateSuccess: false,
  radiusConfigSTR: '',
};

const apiUrl = 'api/gateway';
const apiUrlForClient = 'api/radius-client';
// Actions

export const getEntities = createAsyncThunk(
  'gateway-radius/fetch_entity_list',
  async ({ searchtext, accountId }: IQueryParams, thunkAPI: any) => {
    return axios.get<IListResponseModel>(`${apiUrl}/radius`, { params: { accountId, searchtext } });
  }
);

export const getEntity = createAsyncThunk(
  'gateway-radius/fetch_entity',
  async ({ uid, accountId }: any, thunkAPI: any) => {
    return axios.get<IGateway>(`${apiUrl}/radius/get-detail`, { params: { uid, accountId } });
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'gateway-radius/create_entity',
  async (entity: IGateway, thunkAPI) => {
    const result = await axios.post<IGateway>(`${apiUrl}/radius`, cleanEntity(entity));
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
  'gateway-radius/update_entity',
  async (entity: IGateway, thunkAPI) => {
    const { uid, accountId, ...data } = entity;

    const result = await axios.put<IGateway>(`${apiUrl}/radius/edit/${uid}`, data);

    thunkAPI.dispatch(getEntity({ uid, accountId }));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'gateway-radius/delete_entity',
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

// Radius Client apis

export const createClient = createAsyncThunk(
  'radius-client/create_client',
  async (entity: IRadiusClientCreateModel, thunkAPI) => {
    const result = await axios.post<IGateway>(`${apiUrlForClient}`, cleanEntity(entity));
    thunkAPI.dispatch(
      getClientsByGateway({
        accountId: entity?.accountId,
        gatewayId: entity?.gatewayId,
      })
    );
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const getClients = createAsyncThunk(
  'radius-clients/fetch_client_list',
  async ({ searchtext, accountId }: IQueryParams, thunkAPI: any) => {
    return axios.get<IListResponseModel>(`${apiUrlForClient}`, { params: { accountId, searchtext } });
  }
);

export const getClientsByGateway = createAsyncThunk(
  'radius-clients/fetch_client_list_by_gateway',
  async ({ searchtext, accountId, gatewayId }: IQueryParams, thunkAPI: any) => {
    return axios.get<IListResponseModel>(`${apiUrlForClient}/get-all-by-gateway`, { params: { searchtext, accountId, gatewayId } });
  }
);

export const getClientDetail = createAsyncThunk(
  'radius-clients/fetch_client_detail',
  async ({ uid }: any, thunkAPI: any) => {
    return axios.get<IRadiusClientDetailModel>(`${apiUrlForClient}/get-detail`, { params: { uid } });
  },
  { serializeError: serializeAxiosError }
);

export const checkClientName = createAsyncThunk(
  'radius-clients/check_client_name',
  async ({ uid, accountId, name }: IQueryParams, thunkAPI: any) => {
    return axios.get<any>(`${apiUrlForClient}/check-name`, { params: { uid, accountId, name } });
  },
  { serializeError: serializeAxiosError }
);

export const updateClient = createAsyncThunk(
  'radius-client/update_client',
  async (entity: IRadiusClientUpdateModel, thunkAPI) => {
    const { uid, gatewayId, accountId, ...data } = entity;

    const result = await axios.put<IRadiusClientUpdateModel>(`${apiUrlForClient}/${uid}`, data);

    thunkAPI.dispatch(getClientsByGateway({ accountId, gatewayId }));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteClient = createAsyncThunk(
  'radius-client/delete_client',
  async ({ uid, accountId, gatewayId }: IQueryParams, thunkAPI) => {
    const result = await axios.delete(`${apiUrlForClient}/${uid}`);

    thunkAPI.dispatch(getClientsByGateway({ accountId, gatewayId }));

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const downloadRadiusConfig = createAsyncThunk(
  'radius/download',
  async ({ uid }: IQueryParams, thunkAPI: any) => {
    const result = await axios.get<any>(`${apiUrl}/radius/get-config`, {
      params: { uid },
    });

    if (result.data) downloadJsonFile(result.data);

    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const GatewaySlice = createEntitySlice({
  name: 'gatewayRadius',
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

      .addCase(getClientDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.clientDetail = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        showToast('Deleted Radius Gateway Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addCase(deleteClient.fulfilled, state => {
        showToast('Deleted Client Successfully.');
        state.clientLoading = false;
      })
      .addMatcher(isFulfilled(checkClientName), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          checkLoading: false,
          checkedClientName: data,
        };
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entity: {},
          accountId: action.meta.arg.accountId,
          loading: false,
          gatewayRadiusList: data.resultList,
        };
      })
      .addMatcher(isFulfilled(getClients), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          accountId: action.meta.arg.accountId,
          clientLoading: false,
          clientList: data.resultList,
        };
      })
      .addMatcher(isFulfilled(getClientsByGateway), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          accountId: action.meta.arg.accountId,
          clientLoading: false,
          clientListByGateway: data.resultList,
        };
      })
      .addMatcher(isFulfilled(createEntity), (state, action) => {
        showToast('Created Radius Gateway Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(updateEntity), (state, action) => {
        showToast('Updated Radius Gateway Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })

      .addMatcher(isFulfilled(updateClient), (state, action) => {
        showToast('Updated Radius Client Successfully.');
        state.clientLoading = false;
      })
      .addMatcher(isFulfilled(createClient), (state, action) => {
        showToast('Created Radius Client Successfully.');
        state.clientLoading = false;
      })
      .addMatcher(isFulfilled(downloadRadiusConfig), (state, action) => {
        state.downloadRadiusGatewayLoading = false;
        state.radiusConfigSTR = JSON.stringify(action?.payload?.data, null, 2);
      })
      .addMatcher(isPending(getEntities, getEntity, createEntity, updateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.loading = true;
      })
      .addMatcher(isPending(deleteClient, updateClient, createClient), state => {
        state.errorMessage = null;
        state.clientLoading = true;
      })
      .addMatcher(isPending(downloadRadiusConfig), state => {
        state.errorMessage = null;
        state.downloadRadiusGatewayLoading = true;
        state.radiusConfigSTR = '';
      })
      .addMatcher(isPending(getClients, getClientDetail, getClientsByGateway), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.clientLoading = true;
      })
      .addMatcher(isPending(checkClientName), state => {
        state.checkLoading = true;
        state.checkedClientName = null;
      })
      .addMatcher(
        isRejected(
          getEntities,
          getEntity,
          createEntity,
          deleteEntity,
          deleteClient,
          updateEntity,
          updateClient,
          createClient,
          checkClientName,
          getClients,
          getClientDetail,
          downloadRadiusConfig,
          getClientsByGateway
        ),
        (state, action) => {
          showToast(action.error.message, { type: 'error' });

          state.loading = false;
          state.checkLoading = false;
          state.checkedClientName = null;
          state.clientLoading = false;
          state.updating = false;
          state.updateSuccess = false;
          state.downloadRadiusGatewayLoading = false;
          state.checkErrorMessage = action.error.message;
          state.errorMessage = action.error.message;
        }
      );
  },
});

export const { reset, resetErrorMessage } = GatewaySlice.actions;

// Reducer
export default GatewaySlice.reducer;
