import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { showToast } from 'app/shared/hooks/showToast';
import {
  IAddRequestExternalSourceModel,
  IExternalSourceByGroupModel,
  IExternalSourceCheckGroupDN,
  IExternalSourceEditModel,
  IExternalSourceModel,
} from 'app/shared/model/externalSourceModel';
import { IListResponseModel } from 'app/shared/model/ResponseModel';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { cleanEntity } from 'app/shared/util/entity-utils';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState: EntityState<any> = {
  loading: false,
  searchLoading: false,
  checkLoading: false,
  externalSourceLoading: false,
  externalSourceByGroupLoading: false,
  externalSourceExceptGroupLoading: false,
  externalSourceReportLoading: false,
  checkStatus: null,
  errorMessage: null,
  checkErrorMessage: null,
  accountId: null,
  entities: [],
  externalSourceReports: [],
  attributeProfileList: [],
  gatewayLdapList: [],
  externalSourceByGroupList: [],
  externalSourceExceptGroupList: [],
  entity: {} as IExternalSourceModel,
  updating: false,
  updateSuccess: false,
  isResetPassword: null,
};

const apiUrl = 'api/external-source';

// Actions
export const getEntities = createAsyncThunk(
  'externalSource/fetch_entity_list',
  async ({ searchtext, accountId }: IQueryParams, thunkAPI: any) => {
    return axios.get<any>(`${apiUrl}/get-all`, { params: { accountId, searchtext } });
  },
  { serializeError: serializeAxiosError }
);

export const getExternalSourceReports = createAsyncThunk(
  'externalSource/fetch_entity_reports',
  async ({ searchtext, externalSourceId, accountId, page, size, sort, sortDirection }: IQueryParams, thunkAPI: any) => {
    const result = axios.get<any>(`${apiUrl}/report`, {
      params: { accountId, externalSourceId, searchtext, page, size, sort, sortDirection },
    });

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const syncExternalSource = createAsyncThunk(
  'externalSource/sync_ext_source',
  async ({ externalSourceId, accountId, onDetail = false }: any, thunkAPI: any) => {
    const result = axios.get<any>(`${apiUrl}/sync`, {
      params: { accountId, externalSourceId },
    });

    if (onDetail) {
      thunkAPI.dispatch(
        getEntity({
          groupId: externalSourceId,
        })
      );
    } else {
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

export const getAllExternalSource = createAsyncThunk(
  'externalSource/fetch_externalsource_list',
  async ({ searchtext, accountId }: IQueryParams, thunkAPI: any) => {
    return axios.get<any>(`${apiUrl}/get-all`, { params: { accountId, searchtext } });
  }
);

export const getLdapGatewayList = createAsyncThunk(
  'gateway-ldap/fetch_entity_list',
  async ({ searchtext, accountId }: IQueryParams, thunkAPI: any) => {
    return axios.get<any>(`api/gateway/ldap`, { params: { accountId, searchtext } });
  }
);

export const getAttributeProfiles = createAsyncThunk(
  'ldap-profiles/fetch_entity_listss',
  async ({ searchtext, accountId }: IQueryParams, thunkAPI: any) => {
    const requestUrl = 'api/ldap-profiles';

    return axios.get<IListResponseModel>(requestUrl, { params: { accountId, searchtext } });
  }
);

export const getEntity = createAsyncThunk(
  'externalSource/fetch_entity',
  async ({ groupId }: { groupId: string }, thunkAPI: any) => {
    return axios.get<any>(`${apiUrl}/get-detail`, { params: { groupId } });
  },
  { serializeError: serializeAxiosError }
);
export const checkGroupDN = createAsyncThunk(
  'externalSource/check_group_dn',
  async (entity: IExternalSourceCheckGroupDN, thunkAPI: any) => {
    return axios.get<any>(`${apiUrl}/check-groupdn`, { params: entity });
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'externalSource/create_entity',
  async (entity: IAddRequestExternalSourceModel, thunkAPI: any) => {
    const result = await axios.post<any>(`${apiUrl}/add`, cleanEntity(entity));

    thunkAPI.dispatch(
      getEntities({
        accountId: entity.accountId,
      })
    );

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'externalSource/update_entity',
  async (entity: IExternalSourceEditModel, thunkAPI) => {
    const { uid, ...rest } = entity;
    const result = await axios.put<any>(`${apiUrl}/edit/${uid}`, cleanEntity(rest));

    thunkAPI.dispatch(getEntity({ groupId: entity.uid }));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const changeEntityStatus = createAsyncThunk(
  'externalSource/change_entity_status',
  async (
    entity: {
      uid: string;
      status: boolean;
    },
    thunkAPI: any
  ) => {
    const result = await axios.put(`${apiUrl}/change-status/${entity.uid}`, { status: entity.status });

    thunkAPI.dispatch(getEntity({ groupId: entity.uid }));

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const getExternalSourceByGroup = createAsyncThunk(
  'externalSource/get_all_by_group',
  async (params: IExternalSourceByGroupModel, thunkAPI: any) => {
    return axios.get<any>(`${apiUrl}/get-all-by-group`, { params });
  }
);

export const getExternalSourceExceptGroup = createAsyncThunk(
  'externalSource/get_all_except_group',
  async (params: IExternalSourceByGroupModel, thunkAPI: any) => {
    return axios.get<any>(`${apiUrl}/get-all-by-group`, { params });
  }
);
export const deleteEntity = createAsyncThunk(
  'externalSource/delete_entity',
  async ({ uid, accountId, onDetail }: any, thunkAPI) => {
    const requestUrl = `${apiUrl}/${uid}`;
    const result = await axios.delete(requestUrl);

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
export const ExternalSource = createEntitySlice({
  name: 'externalSource',
  initialState,
  reducers: {
    resetErrorMessage(state) {
      return { ...state, errorMessage: null };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(syncExternalSource.fulfilled, (state, action) => {
        showToast('Sync Request Sent!');
        state.syncExternalSourceLoading = false;
      })
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {} as IExternalSourceModel;
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
      .addMatcher(isFulfilled(getExternalSourceReports), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entityCount: data?.totalCount,
          externalSourceReportLoading: false,
          externalSourceReports: data?.resultList,
        };
      })
      .addMatcher(isFulfilled(getAllExternalSource), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,

          accountId: action.meta.arg.accountId,
          externalSourceLoading: false,
          externalSourceList: data.resultList,
        };
      })
      .addMatcher(isFulfilled(getExternalSourceByGroup), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          externalSourceByGroupLoading: false,
          externalSourceByGroupList: data.resultList,
        };
      })
      .addMatcher(isFulfilled(getExternalSourceExceptGroup), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          externalSourceExceptGroupLoading: false,
          externalSourceExceptGroupList: data.resultList,
        };
      })
      .addMatcher(isFulfilled(checkGroupDN), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          checkLoading: false,
          checkStatus: data,
        };
      })
      .addMatcher(isFulfilled(getLdapGatewayList), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,

          accountId: action.meta.arg.accountId,
          loading: false,
          gatewayLdapList: data.resultList,
        };
      })
      .addMatcher(isFulfilled(getAttributeProfiles), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,

          accountId: action.meta.arg.accountId,
          searchLoading: false,
          attributeProfileList: data.resultList,
        };
      })
      .addMatcher(isFulfilled(updateEntity), (state, action) => {
        showToast('External Source Updated Successfully!');
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(createEntity), (state, action) => {
        showToast('External Source Created Successfully!');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(changeEntityStatus), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isPending(getEntities, getEntity, createEntity, changeEntityStatus, deleteEntity, updateEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.loading = true;
      })
      .addMatcher(isPending(getExternalSourceReports), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.externalSourceReportLoading = true;
      })
      .addMatcher(isPending(syncExternalSource), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.syncExternalSourceLoading = true;
      })
      .addMatcher(isPending(getAllExternalSource), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;

        state.externalSourceLoading = true;
      })
      .addMatcher(isPending(getExternalSourceByGroup), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.externalSourceByGroupLoading = true;
      })
      .addMatcher(isPending(getExternalSourceExceptGroup), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.externalSourceExceptGroupLoading = true;
      })
      .addMatcher(isPending(getLdapGatewayList, getAttributeProfiles), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.searchLoading = true;
      })
      .addMatcher(isPending(checkGroupDN), state => {
        state.checkErrorMessage = null;
        state.checkStatus = null;
        state.checkLoading = true;
      })
      .addMatcher(
        isRejected(
          getEntities,
          changeEntityStatus,
          getEntity,
          createEntity,
          deleteEntity,
          updateEntity,
          getAllExternalSource,
          getExternalSourceByGroup,
          getExternalSourceExceptGroup,
          getExternalSourceReports,
          syncExternalSource
        ),
        (state, action) => {
          showToast(action.error.message, { type: 'error' });
          state.loading = false;
          state.externalSourceReportLoading = false;
          state.externalSourceByGroupLoading = false;
          state.externalSourceExceptGroupLoading = false;
          state.syncExternalSourceLoading = false;
          state.updating = false;
          state.updateSuccess = false;
          state.errorMessage = action.error.message;
        }
      )
      .addMatcher(isRejected(getLdapGatewayList, getAttributeProfiles), (state, action) => {
        state.searchLoading = false;
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      })
      .addMatcher(isRejected(checkGroupDN), (state, action) => {
        state.checkLoading = false;
        state.checkErrorMessage = action.error.message;
        state.checkStatus = false;
      });
  },
});

export const { reset, resetErrorMessage } = ExternalSource.actions;

// Reducer
export default ExternalSource.reducer;
