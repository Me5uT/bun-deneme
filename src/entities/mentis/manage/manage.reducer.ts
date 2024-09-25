import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { mockManageList } from 'app/shared/mockdata/ManageList';
import { IManageDetailModel, IManageListModel } from 'app/shared/model/ManageModel';
import { IListResponseModel } from 'app/shared/model/ResponseModel';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';

const initialState: EntityState<any> = {
  loading: false,
  errorMessage: null,
  manageList: [],
  entity: {},
  updating: false,
  updateSuccess: false,
};

const apiUrl = 'api/gateway'; // 'api/mentis-manage';

// Actions
export const getEntities = createAsyncThunk('mentis_manage/fetch_entity_list', (queryParams: IQueryParams, thunkAPI: any) => {
  return true; // axios.get<IListResponseModel>(`${apiUrl}/ldap`, {
  // params: { accountId: queryParams?.accountId, searchtext: queryParams?.searchtext },
  // });
});

export const getEntity = createAsyncThunk(
  'mentis_manage/fetch_entity',
  ({ accountId, uid }: IQueryParams, thunkAPI: any) => {
    return mockManageList.find(m => m.uid === uid); //  axios.get<IListResponseModel>(`${apiUrl}/ldap`, {
    // params: { accountId: queryParams?.accountId, searchtext: queryParams?.searchtext, uid: queryParams?.uid },
    // });
  },
  { serializeError: serializeAxiosError }
);

// slice

export const ManageSlice = createEntitySlice({
  name: 'Manage',
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
        state.entity = action.payload;
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        // const { data } = action.payload;

        return {
          ...state,
          entity: {} as IManageDetailModel,
          loading: false,
          manageList: mockManageList, // data,
        };
      })

      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null;
        state.loading = true;
      })

      .addMatcher(isRejected(getEntities, getEntity), (state, action) => {
        state.loading = false;
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset, resetErrorMessage } = ManageSlice.actions;

// Reducer
export default ManageSlice.reducer;
