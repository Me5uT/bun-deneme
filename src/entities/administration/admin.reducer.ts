import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { showToast } from 'app/shared/hooks/showToast';
import { AdminProfileInt, IAdminModel, IUpdateAdminRequest } from 'app/shared/model/AdminModel';
import { IListResponseModel } from 'app/shared/model/ResponseModel';
import { IResetPasswordModel } from 'app/shared/model/tenant-setting.model';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { cleanEntity } from 'app/shared/util/entity-utils';
import axios from 'axios';

const initialState: EntityState<IAdminModel> = {
  loading: false,
  errorMessage: null,
  accountId: null,
  entities: [],
  entity: {} as IAdminModel,
  updating: false,
  sendVerificationLoading: false,
  updateSuccess: false,
  isResetPassword: null,
};

const apiUrl = 'api/admin';

// Actions
export const getEntities = createAsyncThunk('admin/fetch_entity_list', async ({ searchtext, accountId }: IQueryParams, thunkAPI: any) => {
  const requestUrl = `${apiUrl}/get-all`;

  return axios.get<IListResponseModel>(requestUrl, { params: { accountId, searchtext } });
});

export const getEntity = createAsyncThunk(
  'admin/fetch_entity',
  async ({ adminId, accountId }: any, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-admin-detail`;
    return axios.get<IAdminModel>(requestUrl, { params: { adminId, accountId } });
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'admin/create_entity',
  async (entity: IAdminModel, thunkAPI: any) => {
    const result = await axios.post<IAdminModel>(`${apiUrl}/register`, cleanEntity(entity));

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
  'admin/update_entity',
  async (entity: IUpdateAdminRequest, thunkAPI: any) => {
    const result = await axios.post<any>(`${apiUrl}/edit/${entity.adminId}`, cleanEntity(entity));

    thunkAPI.dispatch(getEntity({ adminId: entity.adminId, accountId: entity.accountId }));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const changeEntityStatus = createAsyncThunk(
  'admin/change_entity_status',
  async (
    entity: {
      accountId: string;
      status: boolean;
      adminId: string;
    },
    thunkAPI: any
  ) => {
    const result = await axios.put(`${apiUrl}/change-status/${entity.adminId}`, { status: entity.status });
    thunkAPI.dispatch(getEntity({ adminId: entity.adminId, accountId: entity.accountId }));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const resetPassword = createAsyncThunk(
  'admin/reset_password',
  async (entity: IResetPasswordModel, thunkAPI: any) => {
    const result = await axios.post<any>(`api/tenant-settings/reset-password`, entity);

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const sendVerification = createAsyncThunk(
  'admin/send_verification',
  async ({ adminUid, accountId }: any, thunkAPI: any) => {
    const result = await axios.post(`${apiUrl}/reset-verification`, { adminUid });

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'admin/delete_entity',
  async ({ adminId, accountId, onDetail }: any, thunkAPI) => {
    const requestUrl = `${apiUrl}/${adminId}`;
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
export const AdminSlice = createEntitySlice({
  name: 'admin',
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
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {} as IAdminModel;
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entity: {} as IAdminModel,
          accountId: action.meta.arg.accountId,
          loading: false,
          entities: data.resultList,
        };
      })
      .addMatcher(isFulfilled(createEntity), (state, action) => {
        showToast('Admin Created Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(updateEntity), (state, action) => {
        showToast('Admin Updated Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })

      .addMatcher(isFulfilled(resetPassword), (state, action) => {
        showToast('Sent Reset Password Email.');

        state.updating = false;
        state.sendVerificationLoading = false;
      })
      .addMatcher(isFulfilled(sendVerification), (state, action) => {
        showToast('Sent Verification Email.');

        state.updating = false;
        state.sendVerificationLoading = false;
      })
      .addMatcher(isFulfilled(changeEntityStatus), (state, action) => {
        showToast('Admin Status Changed Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })

      .addMatcher(isPending(resetPassword), state => {
        state.errorMessage = null;
        state.sendVerificationLoading = true;
      })
      .addMatcher(isPending(sendVerification), state => {
        state.errorMessage = null;
        state.sendVerificationLoading = true;
      })
      .addMatcher(isPending(getEntities, getEntity, createEntity, changeEntityStatus, deleteEntity, updateEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.loading = true;
      })
      .addMatcher(
        isRejected(getEntities, sendVerification, resetPassword, changeEntityStatus, getEntity, createEntity, deleteEntity, updateEntity),
        (state, action) => {
          showToast(action.error.message, { type: 'error' });

          state.loading = false;
          state.sendVerificationLoading = false;
          state.updating = false;
          state.updateSuccess = false;
          state.errorMessage = action.error.message;
        }
      );
  },
});

export const { reset, resetErrorMessage } = AdminSlice.actions;

// Reducer
export default AdminSlice.reducer;
