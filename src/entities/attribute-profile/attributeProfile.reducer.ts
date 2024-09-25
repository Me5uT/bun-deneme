import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IAttributeProfile, defaultValue } from 'app/shared/model/AttributeProfile.model';
import { IListResponseModel } from 'app/shared/model/ResponseModel';
import { showToast } from 'app/shared/hooks/showToast';

const initialState: EntityState<any> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: {},
  updating: false,
  updateSuccess: false,
};

const apiUrl = 'api/ldap-profiles';

// Actions
export const getEntities = createAsyncThunk(
  'ldap-profiles/fetch_entity_list',
  async ({ searchtext, accountId }: IQueryParams, thunkAPI: any) => {
    const requestUrl = `${apiUrl}`;

    return axios.get<IListResponseModel>(requestUrl, { params: { accountId, searchtext } });
  }
);

export const getEntity = createAsyncThunk(
  'ldapProfile/fetch_entity',
  async ({ uid, accountId }: any, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-detail`;
    return axios.get<IAttributeProfile>(requestUrl, { params: { uid, accountId } });
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'ldapProfile/create_entity',
  async (entity: IAttributeProfile, thunkAPI) => {
    const result = await axios.post<IAttributeProfile>(apiUrl, cleanEntity(entity));
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
  'ldapProfile/update_entity',
  async (entity: IAttributeProfile, thunkAPI) => {
    const { uid, accountId, ...data } = entity;

    const result = await axios.put<IAttributeProfile>(`${apiUrl}/edit/${uid}`, data);

    thunkAPI.dispatch(getEntity({ uid, accountId }));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'ldapProfile/delete_entity',
  async ({ attrId, accountId, onDetail }: any, thunkAPI) => {
    const requestUrl = `${apiUrl}/${attrId}`;

    const result = await axios.delete(requestUrl, { data: { accountId } });

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

export const attributeProfileSlice = createEntitySlice({
  name: 'attributeProfile',
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
        showToast('Attribute Profile Deleted Successfully.');

        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entity: {},
          accountId: action.meta.arg.accountId,
          loading: false,
          entities: data.resultList,
        };
      })
      .addMatcher(isFulfilled(updateEntity), (state, action) => {
        showToast('Attribute Profile Updated Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(createEntity), (state, action) => {
        showToast('Attribute Profile Created Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntities, getEntity, createEntity, updateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.loading = true;
      })
      .addMatcher(isRejected(getEntities, getEntity, createEntity, deleteEntity, updateEntity), (state, action) => {
        showToast(action.error.message, { type: 'error' });

        state.loading = false;
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset, resetErrorMessage } = attributeProfileSlice.actions;

// Reducer
export default attributeProfileSlice.reducer;
