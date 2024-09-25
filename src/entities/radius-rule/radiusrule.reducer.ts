import {
  createAsyncThunk,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import {
  IEditRuleGroupRequest,
  IEditRuleUsersRequest,
  IRadisRuleSortByOrder,
  IRadiusRuleAddRequestModel,
  IRadiusRuleDetailModel,
  IUpdateStatus,
} from "app/shared/model/RadiusRulesModel";
import { IListResponseModel } from "app/shared/model/ResponseModel";
import {
  EntityState,
  IQueryParams,
  createEntitySlice,
  serializeAxiosError,
} from "app/shared/reducers/reducer.utils";
import { RULE_ATTRIBUTE_TYPES } from "app/shared/util/LocalStorage";
import { createSerializedObject } from "app/shared/util/UtilityService";
import { cleanEntity } from "app/shared/util/entity-utils";
import axios from "axios";
import { Storage } from "app/shared/util/LocalStorage";

import {
  getParticipantByRule,
  getParticipantBySelection,
  getParticipantExpectRule,
} from "../user/usertemp.reducer";
import { getGroupByRule, getGroupExpectRule } from "../group/group.reducer";
import { toast } from "react-toastify";
import { showToast } from "app/shared/hooks/showToast";

const initialState: EntityState<any> = {
  loading: false,
  detailLoading: false,
  errorMessage: null,
  entities: [],
  authorizationAttributeTypes: [],
  entity: {} as IRadiusRuleDetailModel,
  entityCount: 0,
  updating: false,
  updateSuccess: false,
  deleteSuccess: false,
  createSuccess: false,
  participantExpectRuleLoading: false,
  participantByRuleLoading: false,
  groupByRuleLoading: false,
  groupExpectRuleLoading: false,
  accountId: null as string,
  isAllParticipantsIncluded: null,
};

const apiUrl = "api/rule";

// Actions

export const getEntities = createAsyncThunk(
  "rules/fetch_entity_list",
  async (
    {
      accountId,
      searchtext,
      name,
      status,
      client,
      user,
      group,
      action,
      isAccept,
    }: IQueryParams,
    thunkAPI: any
  ) => {
    const params = createSerializedObject({
      accountId,
      searchtext,
      name,
      status,
      client,
      user,
      group,
      action,
      isAccept,
    });

    return axios.get<IListResponseModel>(apiUrl, {
      params,
    });
  }
);

export const getEntity = createAsyncThunk(
  "rules/fetch_entity",
  async (uid: string) => {
    const requestUrl = `${apiUrl}/get-detail`;
    return axios.get<IRadiusRuleDetailModel>(requestUrl, {
      params: { uid },
    });
  },
  { serializeError: serializeAxiosError }
);

export const getAuthorizationAttributeTypes = createAsyncThunk(
  "rules/attribute_types",
  async () => {
    const requestUrl = `${apiUrl}/authorization-attribute-types`;
    return axios.get<any[]>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  "rules/create_entity",
  async (entity: IRadiusRuleAddRequestModel, thunkAPI: any) => {
    const result = await axios.post<IRadiusRuleAddRequestModel>(
      apiUrl,
      cleanEntity(entity)
    );

    thunkAPI.dispatch(
      getEntities({
        accountId: entity.accountId,
      })
    );
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const sortRuleByOrder = createAsyncThunk(
  "rules/sort_entity",
  async (entity: IRadisRuleSortByOrder, thunkAPI: any) => {
    const result = await axios.post<IListResponseModel>(
      `${apiUrl}/radius/change-rule-order`,
      entity
    );

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const cloneRadiusRule = createAsyncThunk(
  "rules/clone_entity",
  async (
    ruleData: { radiusRuleUid: string; accountId: string },
    thunkAPI: any
  ) => {
    const result = await axios.post<IRadiusRuleAddRequestModel>(
      `${apiUrl}/add-clone`,
      {
        uid: ruleData.radiusRuleUid,
      }
    );

    thunkAPI.dispatch(
      getEntities({
        accountId: ruleData.accountId,
      })
    );

    if (result) showToast("Radius Rule Cloned.");

    return result;
  },
  { serializeError: serializeAxiosError }
);
export const changeEntityStatus = createAsyncThunk(
  "rules/change_entity_status",
  async (entity: IUpdateStatus, thunkAPI) => {
    const result = await axios.put(
      `${apiUrl}/change-status/${entity.ruleUid}`,
      { status: entity.status }
    );
    thunkAPI.dispatch(getEntity(entity.ruleUid));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const changeEntityAccept = createAsyncThunk(
  "rules/change_entity_accept",
  async (entity: IUpdateStatus, thunkAPI) => {
    const result = await axios.put(
      `${apiUrl}/change-accept/${entity.ruleUid}`,
      { status: entity.status }
    );
    thunkAPI.dispatch(getEntity(entity.ruleUid));
    return result;
  },
  { serializeError: serializeAxiosError }
);
export const editRadiusRule = createAsyncThunk(
  "rules/edit_entity",
  async (entity: Partial<IRadiusRuleDetailModel>, thunkAPI) => {
    const result = await axios.put(`${apiUrl}/edit/${entity.uid}`, entity);
    thunkAPI.dispatch(getEntity(entity.uid));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const addOrRemoveParticipantToRule = createAsyncThunk(
  "rule/add_or_remove_rule_participants",
  async (entity: IEditRuleUsersRequest, thunkAPI: any) => {
    const { ruleId, ...data } = entity;

    const result = await axios.put(`${apiUrl}/${ruleId}/participant`, data);

    thunkAPI.dispatch(
      getParticipantByRule({
        size: 10,
        page: 0,
        ruleId,
        searchtext: "",
        isExcept: false,
      })
    );

    thunkAPI.dispatch(getEntity(ruleId));

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const addOrRemoveGroupToRule = createAsyncThunk(
  "rule/add_or_remove_rule_groups",

  async (entity: IEditRuleGroupRequest, thunkAPI: any) => {
    const { ruleId, ...data } = entity;

    const result = await axios.put(
      `${apiUrl}/${ruleId}/participant-group`,
      data
    );

    thunkAPI.dispatch(
      getGroupByRule({
        ruleId,
        searchtext: "",
        isExcept: false,
      })
    );

    thunkAPI.dispatch(
      getGroupExpectRule({
        ruleId,
        searchtext: "",
        isExcept: true,
      })
    );
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  "rules/delete_entity",
  async ({ uid, accountId, onDetail = false }: any, thunkAPI) => {
    const result = await axios.delete(`${apiUrl}/${uid}`);

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

export const RulesSlice = createEntitySlice({
  name: "radiusrules",
  initialState,
  reducers: {
    resetErrorMessage(state) {
      return { ...state, errorMessage: null };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.entity = action.payload.data;
        state.isAllParticipantsIncluded =
          action.payload.data?.isAllParticipantsIncluded;
      })
      .addCase(deleteEntity.fulfilled, (state) => {
        showToast("Radius Rule Deleted Successfully!");
        state.loading = false;
        state.deleteSuccess = true;
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
          entityCount: data.totalCount,
        };
      })
      .addMatcher(isFulfilled(sortRuleByOrder), (state, action) => {
        const { data } = action.payload;
        showToast("Changed Rule Order Successfully.");
        return {
          ...state,
          entity: {},
          accountId: action.meta.arg.accountId,
          entities: data.resultList,
          entityCount: data.totalCount,
        };
      })
      .addMatcher(
        isFulfilled(getAuthorizationAttributeTypes),
        (state, action) => {
          const types = action.payload.data.map((type) => ({
            label: type.key,
            value: type.value,
          }));
          Storage.local.set(RULE_ATTRIBUTE_TYPES, types);
        }
      )
      .addMatcher(isFulfilled(createEntity), (state, action) => {
        showToast("Radius Rule Created Successfully!");
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = "";
        state.entity = action.payload.data;
      })
      .addMatcher(isFulfilled(changeEntityAccept), (state, action) => {
        showToast("Radius Rule Acceptance Changed Successfully!");
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(editRadiusRule), (state, action) => {
        showToast("Radius Rule Updated Successfully!");
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(changeEntityStatus), (state, action) => {
        showToast("Radius Rule Status Changed Successfully!");
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(
        isFulfilled(addOrRemoveParticipantToRule),
        (state, action) => {
          showToast("Radius Rule Participants Changed Successfully!");
          state.updating = false;
          state.participantByRuleLoading = false;
          state.participantExpectRuleLoading = false;
          state.updateSuccess = true;
          state.isAllParticipantsIncluded =
            action.payload.data?.isAllParticipantsIncluded;
        }
      )
      .addMatcher(isFulfilled(addOrRemoveGroupToRule), (state, action) => {
        showToast("Radius Rule Groups Changed Successfully!");
        state.updating = false;
        state.groupByRuleLoading = false;
        state.groupExpectRuleLoading = false;
        state.updateSuccess = true;
      })
      .addMatcher(
        isPending(
          getEntities,
          sortRuleByOrder,
          createEntity,
          changeEntityStatus,
          changeEntityAccept,
          editRadiusRule
        ),
        (state) => {
          state.errorMessage = null;
          state.updateSuccess = false;
          // state.loading = true;
        }
      )
      .addMatcher(isPending(getEntity), (state) => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.detailLoading = true;
      })
      .addMatcher(isPending(deleteEntity), (state) => {
        state.errorMessage = null;
        state.deleteSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(addOrRemoveParticipantToRule), (state) => {
        state.errorMessage = null;
        state.participantByRuleLoading = true;
        state.participantExpectRuleLoading = true;
      })
      .addMatcher(isPending(addOrRemoveGroupToRule), (state) => {
        state.errorMessage = null;
        state.groupByRuleLoading = true;
        state.groupExpectRuleLoading = true;
      })
      .addMatcher(
        isRejected(
          getEntities,
          sortRuleByOrder,
          getEntity,
          createEntity,
          changeEntityStatus,
          changeEntityAccept,
          editRadiusRule,
          deleteEntity,
          addOrRemoveParticipantToRule,
          addOrRemoveGroupToRule
        ),
        (state, action) => {
          showToast(action.error.message, { type: "error" });

          state.loading = false;
          state.detailLoading = false;
          state.updating = false;
          state.updateSuccess = false;
          state.deleteSuccess = false;
          state.authorizationAttributeTypesLoading = false;
          state.participantByRuleLoading = false;
          state.participantExpectRuleLoading = false;
          state.groupByRuleLoading = false;
          state.groupExpectRuleLoading = false;
          state.errorMessage = action.error.message;
        }
      );
  },
});

export const { reset, resetErrorMessage } = RulesSlice.actions;

// Reducer
export default RulesSlice.reducer;
