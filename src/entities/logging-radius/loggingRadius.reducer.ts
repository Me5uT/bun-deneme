import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IRadiusLogModel } from 'app/shared/model/LoggingModel';
import { IListResponseModel } from 'app/shared/model/ResponseModel';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';

const initialState: EntityState<IRadiusLogModel> = {
  loading: false,
  loglookupLoading: false,
  errorMessage: null,
  accountId: null,
  entities: [],
  entity: {} as IRadiusLogModel,
  logEndUserIPs: [],
  logMessages: [],
  logTypes: [],
  updating: false,
  updateSuccess: false,
  isResetPassword: null,
};

const apiUrl = 'api/radius-log';

// Actions
export const getEntities = createAsyncThunk('loggingRadius/fetch_log_list', async (queryParams: IQueryParams, thunkAPI: any) => {
  return axios.post<IListResponseModel>(`${apiUrl}`, queryParams);
});

// export const getEntity = createAsyncThunk(
//   'loggingAudit/fetch_entity',
//   async ({ adminId, accountId }: any, thunkAPI: any) => {
//     const requestUrl = `${apiUrl}/get-admin-detail`;
//     return axios.get<IRadiusLogModel>(requestUrl, { params: { adminId, accountId } });
//   },
//   { serializeError: serializeAxiosError }
// );
// export const getLogLookup = createAsyncThunk(
//   'loggingAudit/loglookup',
//   async () => {
//     const requestUrl = `${apiUrl}/lookup`;
//     return axios.get<[string, number][]>(requestUrl);
//   },
//   { serializeError: serializeAxiosError }
// );
// slice

export const loggingAuditSlice = createEntitySlice({
  name: 'loggingAudit',
  initialState,
  extraReducers(builder) {
    builder
      // .addCase(getEntity.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.entity = action.payload.data;
      // })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entity: {} as IRadiusLogModel,
          loading: false,
          entities: data.resultList,
          entityCount: data.totalCount,
        };
      })
      // .addMatcher(isFulfilled(getLogLookup), (state, action) => {
      //   const { data } = action.payload;

      //   const { messages, logTypes, IPs } = serializeLogLookUp(data);
      //   return {
      //     ...state,
      //     logEndUserIPs: IPs,
      //     logMessages: messages,
      //     logTypes,
      //     loglookupLoading: false,
      //   };
      // })
      .addMatcher(isPending(getEntities), state => {
        state.errorMessage = null;
        state.loading = true;
      })
      // .addMatcher(isPending(getEntity), state => {
      //   state.errorMessage = null;
      //   state.loading = true;
      // })
      // .addMatcher(isPending(getLogLookup), state => {
      //   state.errorMessage = null;
      //   state.loglookupLoading = true;
      // })
      .addMatcher(
        isRejected(
          getEntities
          //  getEntity,
          // getLogLookup
        ),
        (state, action) => {
          state.loading = false;
          state.loglookupLoading = false;
          state.updating = false;
          state.updateSuccess = false;
          state.errorMessage = action.error.message;
        }
      );
  },
});

export const { reset } = loggingAuditSlice.actions;

// Reducer
export default loggingAuditSlice.reducer;
