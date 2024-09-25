import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { IAuditLogModel } from 'app/shared/model/LoggingModel';
import { IListResponseModel } from 'app/shared/model/ResponseModel';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { serializeLogLookUp } from 'app/shared/util/LogMessage';
import axios from 'axios';

const initialState: EntityState<IAuditLogModel> = {
  loading: false,
  loglookupLoading: false,
  errorMessage: null,
  accountId: null,
  entities: [],
  entity: {} as IAuditLogModel,
  logEndUserIPs: [],
  logMessages: [],
  logTypes: [],
  updating: false,
  updateSuccess: false,
  isResetPassword: null,
};

const apiUrl = 'api/log';

// Actions
export const getEntities = createAsyncThunk('loggingAudit/fetch_entity_list', async (queryParams: IQueryParams, thunkAPI: any) => {
  const { pagination, ...args } = queryParams;

  return axios.post<IListResponseModel>(`${apiUrl}`, { ...args, pagination });
});

export const getEntity = createAsyncThunk(
  'loggingAudit/fetch_entity',
  async ({ adminId, accountId }: any, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-admin-detail`;
    return axios.get<IAuditLogModel>(requestUrl, { params: { adminId, accountId } });
  },
  { serializeError: serializeAxiosError }
);
export const getLogLookup = createAsyncThunk(
  'loggingAudit/loglookup',
  async () => {
    const requestUrl = `${apiUrl}/lookup`;
    return axios.get<[string, number][]>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);
// slice

export const loggingAuditSlice = createEntitySlice({
  name: 'loggingAudit',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entity: {} as IAuditLogModel,
          loading: false,
          accountId: action.meta.arg.accountId,
          entities: data.resultList,
          entityCount: data.totalCount,
          // entities: data.map((log: IAuditLogModel) => ({
          //   ...log,

          //   message: serializeLogMessage(log.message, log.sentparams, log.logtype, log.responseStatus),
          //   messageWithoutObject: log.message,
          //   browserheader: getBrowserInfo(log.browserheader),
          //   object: serializeLogObject(log.displayParams, log.apiname),
          // })),
        };
      })
      .addMatcher(isFulfilled(getLogLookup), (state, action) => {
        const { data } = action.payload;

        const { messages, logTypes, IPs } = serializeLogLookUp(data);
        return {
          ...state,
          logEndUserIPs: IPs,
          logMessages: messages,
          logTypes,
          loglookupLoading: false,
        };
      })
      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null;
        state.loading = true;
      })
      .addMatcher(isPending(getLogLookup), state => {
        state.errorMessage = null;
        state.loglookupLoading = true;
      })
      .addMatcher(isRejected(getEntities, getEntity, getLogLookup), (state, action) => {
        state.loading = false;
        state.loglookupLoading = false;
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset } = loggingAuditSlice.actions;

// Reducer
export default loggingAuditSlice.reducer;
