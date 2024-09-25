import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { showToast } from 'app/shared/hooks/showToast';
import { IExternalSourceModel } from 'app/shared/model/externalSourceModel';
import { ISmsProviderAddRequestModel, ISmsProviderDetailModel, ISmsProviderUpdateRequestModel } from 'app/shared/model/sms-provider.model';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { splitDefaultSmsProviders } from 'app/shared/util/UtilityService';
import axios from 'axios';

const initialState: EntityState<any> = {
  loading: false,
  searchLoading: false,
  checkLoading: false,
  checkStatus: null,
  errorMessage: null,
  checkErrorMessage: null,
  accountId: null,
  entities: [],
  splitedSmsProviderList: [],
  entity: {} as ISmsProviderDetailModel,
  updating: false,
  updateSuccess: false,
  isResetPassword: null,
};

const apiUrl = 'api/otp-provider';

// Actions
export const getEntities = createAsyncThunk(
  'otpprovider/fetch_entity_list',
  async ({ searchtext, accountId }: IQueryParams, thunkAPI: any) => {
    return axios.get<any>(`${apiUrl}`, { params: { accountId, searchtext } });
  }
);

export const getEntity = createAsyncThunk(
  'otpprovider/fetch_entity',
  async ({ uid }: { uid: string }, thunkAPI: any) => {
    return axios.get<any>(`${apiUrl}/get-detail`, { params: { uid } });
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'otpprovider/create_entity',
  async (entity: ISmsProviderAddRequestModel, thunkAPI: any) => {
    const result = await axios.post<any>(`${apiUrl}`, cleanEntity(entity));

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
  'otpprovider/update_entity',
  async (entity: ISmsProviderUpdateRequestModel, thunkAPI) => {
    const { uid, ...rest } = entity;
    const result = await axios.put<any>(`${apiUrl}/${uid}`, cleanEntity(rest));

    thunkAPI.dispatch(getEntity({ uid: entity.uid }));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const changeEntityStatus = createAsyncThunk(
  'otpprovider/change_entity_status',
  async (
    entity: {
      uid: string;
      status: boolean;
    },
    thunkAPI: any
  ) => {
    const result = await axios.put(`${apiUrl}/change-status/${entity.uid}`, { status: entity.status });

    thunkAPI.dispatch(getEntity({ uid: entity.uid }));

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'otpprovider/delete_entity',
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
export const SmsProviderReducer = createEntitySlice({
  name: 'smsProvider',
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
        showToast('Sms Provider Deleted Successfully.');

        state.loading = false;
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
          splitedSmsProviderList: splitDefaultSmsProviders(data.resultList),
        };
      })
      .addMatcher(isFulfilled(updateEntity), (state, action) => {
        showToast('Sms Provider Updated Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(createEntity), (state, action) => {
        showToast('Sms Provider Created Successfully.');

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

      .addMatcher(isRejected(getEntities, changeEntityStatus, getEntity, createEntity, deleteEntity, updateEntity), (state, action) => {
        showToast(action.error.message, { type: 'error' });

        state.loading = false;
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset, resetErrorMessage } = SmsProviderReducer.actions;

// Reducer
export default SmsProviderReducer.reducer;
