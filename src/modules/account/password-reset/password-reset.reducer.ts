import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import axios from 'axios';

import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IChangePasswordModel, ICheckChangePasswordRequestModel } from 'app/shared/model/tenant-setting.model';

const initialState: any = {
  loading: false,
  canChangePassword: false,
  isChangedPassword: false,
  resetPasswordSuccess: false,
  resetPasswordFailure: false,
  successMessage: null,
  errorMessage: null,
};

export type PasswordResetState = Readonly<typeof initialState>;

const apiUrl = 'api/tenant-settings';
// Actions

export const handlePasswordResetInit = createAsyncThunk(
  'passwordReset/reset_password_init',
  // If the content-type isn't set that way, axios will try to encode the body and thus modify the data sent to the server.
  async (entity: any, thunkAPI: any) => {
    const result = await axios.post(`${apiUrl}/forget-password`, cleanEntity(entity));

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const checkChangePassword = createAsyncThunk(
  'tenant-settings/check_change_password',
  async (entity: ICheckChangePasswordRequestModel, thunkAPI) => {
    const result = await axios.get(`${apiUrl}/check-change-password`, {
      params: {
        passwordtoken: entity.passwordtoken,
        recordtype: entity.recordtype,
      },
    });

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const changePassword = createAsyncThunk(
  'tenant-settings/change_password',
  async (entity: IChangePasswordModel, thunkAPI: any) => {
    const result = await axios.post<any>(`${apiUrl}/change-password`, cleanEntity(entity));

    // thunkAPI.dispatch(checkChangePassword({ passwordtoken: entity.passwordToken, recordtype: entity.recordType }));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const PasswordResetSlice = createSlice({
  name: 'passwordReset',
  initialState: initialState as PasswordResetState,
  reducers: {
    reset() {
      return initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(handlePasswordResetInit.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        resetPasswordSuccess: true,
      }))
      .addCase(checkChangePassword.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        canChangePassword: true,
      }))
      .addCase(changePassword.fulfilled, (state, action) => ({
        ...state,
        loading: false,
        isChangedPassword: true,
        errorMessage: null,
      }))
      .addMatcher(isPending(handlePasswordResetInit, checkChangePassword, changePassword), state => ({
        ...state,
        loading: true,
        errorMessage: null,
      }))
      .addMatcher(isRejected(checkChangePassword), (state, action) => ({
        ...state,
        loading: false,
        canChangePassword: false,
        resetPasswordFailure: true,
      }))
      .addMatcher(isRejected(handlePasswordResetInit, changePassword), (state, action) => ({
        ...state,
        loading: false,
        isChangedPassword: false,
        resetPasswordFailure: true,
        errorMessage: action.error.message,
      }));
  },
});

export const { reset } = PasswordResetSlice.actions;

// Reducer
export default PasswordResetSlice.reducer;
