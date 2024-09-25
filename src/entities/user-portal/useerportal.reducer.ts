import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { showToast } from 'app/shared/hooks/showToast';
import { IAdminModel } from 'app/shared/model/AdminModel';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { serializeEnableMfaList } from 'app/shared/util/UtilityService';
import axios from 'axios';

const initialState: EntityState<any> = {
  loading: false,
  errorMessage: null,
  accountId: null,
  entities: [],
  entity: {} as IAdminModel,
  updating: false,
  sendVerificationLoading: false,
  updateSuccess: false,
  isResetPassword: null,
  enableMfaMethods: {},
};

const apiUrl = 'api/userportal/mfa';

// Actions
export const getEntities = createAsyncThunk('userportal/fetch_entity_list', async ({ accountId }: IQueryParams, thunkAPI: any) => {
  return axios.get<any>(`${apiUrl}/${accountId}`);
});

export const updateEntity = createAsyncThunk(
  'userportal/update_entity',
  async ({ enableMfaMethods, tenantId }: any, thunkAPI: any) => {
    const result = await axios.put<any>(`${apiUrl}`, {
      ...enableMfaMethods,
      tenantId,
    });

    thunkAPI.dispatch(getEntities({ accountId: tenantId }));
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice
export const UserPortalSlice = createEntitySlice({
  name: 'admin',
  initialState,
  reducers: {
    resetErrorMessage(state) {
      return { ...state, errorMessage: null };
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          enableMfaMethods: serializeEnableMfaList(data),
        };
      })
      .addMatcher(isFulfilled(updateEntity), (state, action) => {
        showToast('Selected MFA Methods Successfully.');

        state.loading = false;
        state.errorMessage = '';
      })

      .addMatcher(isPending(getEntities, updateEntity), state => {
        state.loading = true;
      })
      .addMatcher(isRejected(getEntities, updateEntity), (state, action) => {
        showToast(action.error.message, { type: 'error' });

        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset, resetErrorMessage } = UserPortalSlice.actions;

// Reducer
export default UserPortalSlice.reducer;
