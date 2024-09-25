import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import axios from 'axios';

import {
  IEditGroupExternalSourceRequest,
  IEditGroupUsersRequest,
  IGroup,
  IGroupByParticipantModel,
  IGroupByRuleModel,
  defaultValue,
} from 'app/shared/model/GroupModel';
import { IListResponseModel } from 'app/shared/model/ResponseModel';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { createSerializedObject } from 'app/shared/util/UtilityService';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { getExternalSourceByGroup, getExternalSourceExceptGroup } from '../external-source/externalSource.reducer';
import { showToast } from 'app/shared/hooks/showToast';

const initialState: EntityState<IGroup> = {
  loading: false,
  groupLoading: false,
  externalSourceLoading: false,
  groupByRuleLoading: false,
  groupExpectRuleLoading: false,
  externalSourceByGroupLoading: false,
  externalSourceExceptGroupLoading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  groupList: [],
  groupByParticipantList: [],
  groupByRuleList: [],
  groupExceptRuleList: [],
  groupExceptParticipantList: [],
  externalSourceList: [],
  groupByParticipantLoading: false,
  groupExpectParticipantLoading: false,
  entityCountGroup: 0,
  externalSourceCount: 0,
};

const apiUrl = 'api/participant-group';

// Actions

export const getEntities = createAsyncThunk(
  'group/fetch_entity_list',
  async ({ page, size, sort, accountId, searchtext, participantid, exceptparticipantid }: IQueryParams) => {
    const requestUrl = `${apiUrl}/get-all`;
    const serializedParams = createSerializedObject({ page, size, sort, accountId, searchtext, participantid, exceptparticipantid });

    return axios.get<IListResponseModel>(requestUrl, {
      params: serializedParams,
    });
  }
);

export const getAllGroup = createAsyncThunk(
  'group/fetch_group_list',
  async ({ page, size, sort, accountId, searchtext, participantid, exceptparticipantid }: IQueryParams) => {
    const requestUrl = `${apiUrl}/get-all`;
    const serializedParams = createSerializedObject({ page, size, sort, accountId, searchtext, participantid, exceptparticipantid });

    return axios.get<IListResponseModel>(requestUrl, {
      params: serializedParams,
    });
  }
);

export const getAllLDAP = createAsyncThunk(
  'group/fetch_ldap_list',
  async ({ page, size, sort, accountId, searchtext, participantid, exceptparticipantid }: IQueryParams) => {
    const requestUrl = `${apiUrl}/get-all-ldap`;
    const serializedParams = createSerializedObject({ page, size, sort, accountId, searchtext, participantid, exceptparticipantid });

    return axios.get<any[]>(requestUrl, {
      params: serializedParams,
    });
  }
);
export const getEntity = createAsyncThunk(
  'group/fetch_entity',
  async ({ groupId, accountId }: IQueryParams, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-detail`;
    return axios.get<IGroup>(requestUrl, { params: { groupId, accountId } });
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'group/create_entity',
  async (entity: IGroup, thunkAPI) => {
    const result = await axios.post<IGroup>(`${apiUrl}/add`, cleanEntity(entity));
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
  'group/update_entity',
  async (entity: IGroup, thunkAPI) => {
    const result = await axios.put<IGroup>(`${apiUrl}/edit/${entity.uid}`, cleanEntity(entity));

    thunkAPI.dispatch(getEntity({ accountId: entity.accountId, groupId: entity.uid }));

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const changeEntityStatus = createAsyncThunk(
  'group/change_entity_status',
  async (
    entity: {
      accountId: string;
      status: boolean;
      groupId: string;
    },
    thunkAPI: any
  ) => {
    const result = await axios.put(`${apiUrl}/change-status/${entity.groupId}`, { status: entity.status });
    // thunkAPI.dispatch(getEntity({ groupId: entity.groupId, accountId: entity.accountId }));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const getGroupParticipants = createAsyncThunk(
  'group/get_group_participants',
  async (param: any, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/group-participants`;

    const searchData = createSerializedObject(param);

    return axios.get<any>(requestUrl, { params: searchData });
  },
  { serializeError: serializeAxiosError }
);

export const getGroupByParticipants = createAsyncThunk(
  'group/get_group_by_participants',
  async (param: IGroupByParticipantModel, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-all-by-participant`;

    const searchData = createSerializedObject(param);

    return axios.get<any>(requestUrl, { params: searchData });
  },
  { serializeError: serializeAxiosError }
);

export const getGroupExpectParticipants = createAsyncThunk(
  'group/get_group_expect_participants',
  async (param: IGroupByParticipantModel, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-all-by-participant`;

    const searchData = createSerializedObject(param);

    return axios.get<any>(requestUrl, { params: searchData });
  },
  { serializeError: serializeAxiosError }
);

export const getGroupByRule = createAsyncThunk(
  'group/get_group_by_rule',
  async (param: IGroupByRuleModel, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-all-by-rule`;

    const searchData = createSerializedObject(param);

    return axios.get<any>(requestUrl, { params: searchData });
  },
  { serializeError: serializeAxiosError }
);

export const getGroupExpectRule = createAsyncThunk(
  'group/get_group_expect_rule',
  async (param: IGroupByRuleModel, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-all-by-rule`;

    const searchData = createSerializedObject(param);

    return axios.get<any>(requestUrl, { params: searchData });
  },
  { serializeError: serializeAxiosError }
);

export const addOrRemoveUserToGroup = createAsyncThunk(
  'group/edit_group_participants',
  async (entity: IEditGroupUsersRequest, thunkAPI: any) => {
    const { groupId, ...data } = entity;

    const result = await axios.put(`${apiUrl}/group-participant/${entity.groupId}`, data);

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const addOrRemoveExternalSourceToGroup = createAsyncThunk(
  'group/edit_group_external_source',
  async (entity: IEditGroupExternalSourceRequest, thunkAPI: any) => {
    const { groupId, ...data } = entity;

    const result = await axios.put(`${apiUrl}/external-source/${groupId}`, data);

    thunkAPI.dispatch(
      getExternalSourceByGroup({
        groupId,
        searchtext: '',
        isExcept: false,
      })
    );

    thunkAPI.dispatch(
      getExternalSourceExceptGroup({
        groupId,
        searchtext: '',
        isExcept: true,
      })
    );

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'group/delete_entity',
  async (params: any, thunkAPI) => {
    const { groupId, accountId, onDetail, ...searhData } = params;

    const requestUrl = `${apiUrl}/delete/${groupId}`;
    const result = await axios.delete(requestUrl);

    if (!onDetail) {
      thunkAPI.dispatch(
        getEntities({
          accountId,
          ...searhData,
        })
      );
    }
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const GroupSlice = createEntitySlice({
  name: 'group',
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
        showToast('Group Deleted Successfully.');

        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entity: {},
          entityCount: data.totalCount,
          groupCount: data.totalCount,
          accountId: action.meta.arg.accountId,
          loading: false,
          groupLoading: false,
          entities: data.resultList,
          groupList: data.resultList,
        };
      })
      .addMatcher(isFulfilled(getAllGroup), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          accountId: action.meta.arg.accountId,
          groupLoading: false,
          groupList: data.resultList,
        };
      })
      .addMatcher(isFulfilled(getAllLDAP), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          externalSourceLoading: false,
          externalSourceList: data,
          externalSourceCount: data.length,
        };
      })
      .addMatcher(isFulfilled(getGroupParticipants), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          accountId: action.meta.arg.accountId,
          entityCountGroup: data.totalCount,
          groupByParticipantList: data.resultList,
          groupByParticipantLoading: false,
        };
      })
      .addMatcher(isFulfilled(getGroupByParticipants), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entityCountGroup: data.totalCount,
          groupByParticipantList: data.resultList,
          groupByParticipantLoading: false,
        };
      })
      .addMatcher(isFulfilled(getGroupByRule), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entityCountGroup: data.totalCount,
          groupByRuleList: data.resultList,
          groupByRuleLoading: false,
        };
      })
      .addMatcher(isFulfilled(getGroupExpectParticipants), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entityCountGroup: data.totalCount,
          groupExceptParticipantList: data.resultList,
          groupExpectParticipantLoading: false,
        };
      })
      .addMatcher(isFulfilled(getGroupExpectRule), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          entityCountGroup: data.totalCount,
          groupExceptRuleList: data.resultList,
          groupExpectRuleLoading: false,
        };
      })
      .addMatcher(isFulfilled(createEntity), (state, action) => {
        showToast('Group Created successfully');
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(updateEntity), (state, action) => {
        showToast('Group Updated successfully');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(changeEntityStatus, addOrRemoveUserToGroup), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(addOrRemoveExternalSourceToGroup), (state, action) => {
        state.externalSourceByGroupLoading = false;
        state.externalSourceExceptGroupLoading = false;
      })
      .addMatcher(isPending(getEntities, getEntity, changeEntityStatus, addOrRemoveUserToGroup), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.loading = true;
        state.groupLoading = true;
      })
      .addMatcher(isPending(getAllGroup), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;

        state.groupLoading = true;
      })
      .addMatcher(isPending(addOrRemoveExternalSourceToGroup), state => {
        state.errorMessage = null;
        state.externalSourceByGroupLoading = true;
        state.externalSourceExceptGroupLoading = true;
      })
      .addMatcher(isPending(getAllLDAP), state => {
        state.errorMessage = null;
        state.externalSourceLoading = true;
      })
      .addMatcher(isPending(getGroupParticipants), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.groupByParticipantLoading = true;
      })
      .addMatcher(isPending(getGroupByParticipants), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.groupByParticipantLoading = true;
      })
      .addMatcher(isPending(getGroupByRule), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.groupByRuleLoading = true;
      })
      .addMatcher(isPending(getGroupExpectParticipants), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.groupExpectParticipantLoading = true;
      })
      .addMatcher(isPending(getGroupExpectRule), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.groupExpectRuleLoading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      })
      .addMatcher(
        isRejected(
          getEntities,
          getEntity,
          createEntity,
          updateEntity,
          changeEntityStatus,
          getGroupParticipants,
          getGroupByParticipants,
          getGroupByRule,
          getGroupExpectRule,
          getGroupExpectParticipants,
          deleteEntity,
          addOrRemoveUserToGroup,
          addOrRemoveExternalSourceToGroup,
          getAllLDAP,
          getAllGroup
        ),
        (state, action) => {
          showToast(action.error.message, { type: 'error' });

          state.loading = false;
          state.groupCount = 0;
          state.entityCountGroup = 0;
          state.groupLoading = false;
          state.groupByParticipantLoading = false;
          state.groupByRuleLoading = false;
          state.groupExpectRuleLoading = false;
          state.groupExpectParticipantLoading = false;
          state.externalSourceLoading = false;
          state.updating = false;
          state.updateSuccess = false;
          state.errorMessage = action.error.message;
        }
      );
  },
});

export const { reset, resetErrorMessage } = GroupSlice.actions;

// Reducer
export default GroupSlice.reducer;
