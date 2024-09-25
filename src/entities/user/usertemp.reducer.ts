import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import { showToast } from 'app/shared/hooks/showToast';
import { IListResponseModel } from 'app/shared/model/ResponseModel';
import {
  IDeleteParticipants,
  IEditParticipantGroups,
  IParticipant,
  IParticipantByGroupModel,
  IParticipantByRuleModel,
  IParticipantBySelectionModel,
  IUpdateParticipantStatus,
  SenderTypeInt,
} from 'app/shared/model/participant.model';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { downloadBase64AsXls } from 'app/shared/util/ExportAndDownload';
import { createSerializedObject } from 'app/shared/util/UtilityService';
import { cleanEntity } from 'app/shared/util/entity-utils';
import axios from 'axios';

const initialState: EntityState<IParticipant> = {
  loading: false,
  participantExpectGroupLoading: false,
  participantByGroupLoading: false,
  participantByRuleLoading: false,
  participantExpectRuleLoading: false,
  participantBySelectionLoading: false,
  participantExceptSelectionLoading: false,
  errorMessage: null,
  entities: [],
  entityCount: 0,
  entity: {} as IParticipant,
  exportedItemsBase64Value: '',
  updating: false,
  updateSuccess: false,
  canChangePassword: null,
  isChangedPassword: null,
  participantGroupList: [],
  participantBySelectionList: [],
  participantExceptSelectionList: [],
  participantByRuleList: [],
  participantExceptRuleList: [],
  participantExceptGroupList: [],
  participantByGroupList: [],
  participantBySelectionCount: 0,
  participantExceptSelectionCount: 0,
  participantByRuleCount: 0,
  participantExceptRuleCount: 0,
  participantByGroupCount: 0,
  participantExceptGroupCount: 0,
  participantGroupLoading: false,
  verifyUrl: '',
  verfiyErrorMessage: null,
};

const apiUrl = 'api/participant';

// Actions
export const getEntities = createAsyncThunk(
  'participant/fetch_entity_list',
  async (
    {
      accountId,
      page,
      size,
      sort,
      displayName,
      username,
      mail,
      phone,
      participantType,
      verificationStatus,
      sam,
      isExternal,
      participantGroupUids,
      searchtext,
      name,
      participantStatus,
      multiRegister,
      ldapGroup,
      group,
      isActive,
      isLocked,
      exceptParticipantGroupUid,
    }: IQueryParams,
    thunkAPI: any
  ) => {
    const requestUrl = `${apiUrl}/get-all`;

    const serializedParams = createSerializedObject({
      accountId,
      page,
      size,
      sort,
      displayName,
      username,
      mail,
      phone,
      participantType,
      verificationStatus,
      sam,
      isExternal,
      participantGroupUids,
      searchtext,
      name,
      participantStatus,
      multiRegister,
      ldapGroup,
      group,
      isActive,
      isLocked,
      exceptParticipantGroupUid,
    });
    return axios.get<IListResponseModel>(requestUrl, {
      params: serializedParams,
    });
  }
);

export const getEntity = createAsyncThunk(
  'participant/fetch_entity',
  async ({ participantUid, accountId }: any, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-detail`;

    return axios.get<IParticipant>(requestUrl, {
      params: {
        participantUid,
        accountId,
      },
    });
  },
  { serializeError: serializeAxiosError }
);
export const getTestLDAPUser = createAsyncThunk(
  'participant/add_test_ldap',
  async () => {
    const requestUrl = `${apiUrl}/test-data`;

    return axios.get<IParticipant>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);
export const createEntity = createAsyncThunk(
  'participant/create_entity',
  async (entity: IParticipant, thunkAPI: any) => {
    const { searchParams, ...data } = entity;
    const result = await axios.post<IParticipant>(`${apiUrl}/add`, cleanEntity(data));
    thunkAPI.dispatch(
      getEntities({
        accountId: entity.accountId,
        ...searchParams,
      })
    );
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'participant/update_entity',
  async (entity: IParticipant, thunkAPI) => {
    const { accountId, ...args } = entity;
    const result = await axios.put<IParticipant>(`${apiUrl}/edit/${entity.uid}`, cleanEntity(args));
    thunkAPI.dispatch(getEntity({ participantUid: entity?.uid, accountId }));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const changeEntityStatus = createAsyncThunk(
  'participant/change_entity_status',
  async (entity: IUpdateParticipantStatus, thunkAPI) => {
    const result = await axios.put(`${apiUrl}/change-status/${entity.uid}`, { status: entity.status });
    thunkAPI.dispatch(getEntity({ participantUid: entity?.uid, accountId: entity?.accountId }));

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const sendChangePasswordMail = createAsyncThunk(
  'participant/send_change_password_mail',
  async (participantUid: string, thunkAPI) => {
    const result = await axios.get(`${apiUrl}/send-change-password`, { params: { participantUid } });
    return result;
  },
  { serializeError: serializeAxiosError }
);
export const sendTOTP = createAsyncThunk(
  'participant/send_totp',
  async (participantUid: string, thunkAPI) => {
    const result = await axios.get(`${apiUrl}/send-totp`, { params: { participantUid } });
    return result;
  },
  { serializeError: serializeAxiosError }
);
export const checkTOTPID = createAsyncThunk(
  'participant/check_totp_id',
  async (id: string, thunkAPI) => {
    const result = await axios.get(`${apiUrl}/totp-qr-code`, { params: { id } });
    return result;
  },
  { serializeError: serializeAxiosError }
);
export const onEditParticipantGroups = createAsyncThunk(
  'participant/edit_group_participants',
  async (entity: IEditParticipantGroups, thunkAPI: any) => {
    const { participantId, accountId, ...data } = entity;

    const result = await axios.put(`${apiUrl}/participant-group/${participantId}`, data);

    thunkAPI.dispatch(getEntity({ participantUid: participantId, accountId }));

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const getParticipantGroups = createAsyncThunk(
  'participant/get_participant_groups',
  async (param: any, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/participant-groups`;

    const searchData = createSerializedObject(param);

    return axios.get<any>(requestUrl, { params: searchData });
  },
  { serializeError: serializeAxiosError }
);
export const getParticipantByGroup = createAsyncThunk(
  'participant/get_participant_by_group',
  async (param: IParticipantByGroupModel, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-all-by-group`;

    const searchData = createSerializedObject(param);

    return axios.get<any>(requestUrl, { params: searchData });
  },
  { serializeError: serializeAxiosError }
);

export const getParticipantExpectGroup = createAsyncThunk(
  'participant/get_participant_expect_group',
  async (param: IParticipantByGroupModel, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-all-by-group`;

    const searchData = createSerializedObject(param);

    return axios.get<any>(requestUrl, { params: searchData });
  },
  { serializeError: serializeAxiosError }
);
export const getParticipantByRule = createAsyncThunk(
  'participant/get_participant_by_rule',
  async (param: IParticipantByRuleModel, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-all-by-rule`;

    const searchData = createSerializedObject(param);

    return axios.get<any>(requestUrl, { params: searchData });
  },
  { serializeError: serializeAxiosError }
);

export const getParticipantExpectRule = createAsyncThunk(
  'participant/get_participant_expect_rule',
  async (param: IParticipantByRuleModel, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/get-all-by-rule`;

    const searchData = createSerializedObject(param);

    return axios.get<any>(requestUrl, { params: searchData });
  },
  { serializeError: serializeAxiosError }
);

export const getParticipantBySelection = createAsyncThunk(
  'participant/participant_by_selection',
  async (param: IParticipantBySelectionModel, thunkAPI: any) => {
    const requestUrl = `${apiUrl}/selection`;

    const searchData = createSerializedObject(param);

    return axios.get<any>(requestUrl, { params: searchData });
  },
  { serializeError: serializeAxiosError }
);

export const getParticipantExceptSelection = createAsyncThunk(
  'participant/participant_except_selection',
  async (param: IParticipantBySelectionModel, thunkAPI: any) => {
    const { exceptParticipants, ...args } = param;
    const requestUrl = `${apiUrl}/selection`;

    const exceptParticip = (exp: any[]): string => {
      // switch (true) {
      //   case exp.length === 1 && exp.find((e: any) => typeof e !== 'string' || e === 'a'):
      //     return '';

      //   case exp.length >= 1 && exp.find((e: any) => typeof e !== 'string' || e === 'a'):
      //     return exp.filter((e: any) => typeof e !== 'string' || e === 'a').join(',');

      //   default:
      //     return exp.join(',');
      // }
      return exp.filter(e => e !== 'a').join(',');
    };

    return axios.get<any>(requestUrl, {
      params: {
        ...args,
        exceptParticipants,
      },
    });
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'participant/delete_entity',
  async (params: any, thunkAPI) => {
    const { uid, accountId, onDetail, searchData } = params;
    console.log('🚀 ~ params:', params);

    const result = await axios.delete<IParticipant>(`${apiUrl}s/${uid}`);

    if (!onDetail) {
      thunkAPI.dispatch(
        getEntities({
          accountId,
          ...searchData,
        })
      );
    }

    return result;
  },
  { serializeError: serializeAxiosError }
);
export const deleteEntities = createAsyncThunk(
  'participant/delete_entities',
  async (args: IDeleteParticipants, thunkAPI) => {
    const result = await axios.delete<IParticipant>(`${apiUrl}s`, {
      data: args.uids,
    });

    thunkAPI.dispatch(
      getEntities({
        accountId: args.accountId,
        ...args.searchData,
      })
    );

    return result;
  },
  { serializeError: serializeAxiosError }
);
export const onExportUser = createAsyncThunk(
  'participant/export_user',
  async (
    {
      accountId,
      page,
      size,
      sort,
      displayName,
      username,
      mail,
      phone,
      participantType,
      verificationStatus,
      sam,
      isExternal,
      participantGroupUids,
      searchtext,
      name,
      participantStatus,
      multiRegister,
      ldapGroup,
      group,
      isActive,
      isLocked,
      exceptParticipantGroupUid,
    }: IQueryParams,
    thunkAPI: any
  ) => {
    const requestUrl = `${apiUrl}/export`;
    const { account } = thunkAPI.getState().authentication;

    const base64Value = await axios.get<string>(requestUrl, {
      params: {
        accountId: account?.tenant?.uid,
        page,
        size,
        sort,
        displayName,
        username,
        mail,
        phone,
        participantType,
        verificationStatus,
        sam,
        isExternal,
        participantGroupUids,
        searchtext,
        name,
        participantStatus,
        multiRegister,
        ldapGroup,
        group,
        isActive,
        isLocked,
        exceptParticipantGroupUid,
      },
    });

    if (base64Value.data) downloadBase64AsXls(base64Value.data, 'user-list');
    else throw new Error('Can not download!');
  }
);

export const resetAllVerification = createAsyncThunk(
  'participant/reset_all_verification',
  async (
    entity: {
      inDetail: boolean;
      accountId: string;
      participantUids: string[];
    },
    thunkAPI: any
  ) => {
    const { inDetail, ...ent } = entity;
    const result = await axios.post<IParticipant>(`${apiUrl}/reset-all-verification`, cleanEntity(ent));

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const testSend = createAsyncThunk(
  'participant/testsender',
  async (
    testSender: {
      participantUid: string;
      senderType: number;
    },
    thunkAPI: any
  ) => {
    const resultMessage = (senderT: SenderTypeInt) => {
      switch (senderT) {
        case SenderTypeInt.SMS:
          return 'SMS sent to user.';
        case SenderTypeInt.MIRKETOTP:
          return 'Mirket OTP sent to user.';

        default:
          return '';
      }
    };

    const result = await axios.post<IParticipant>(`${apiUrl}/test-sender`, testSender);

    if (result) showToast(resultMessage(testSender.senderType));

    return result;
  },
  { serializeError: serializeAxiosError }
);

export const testSendPush = createAsyncThunk(
  'participant/testsenderPush',
  async (
    testSender: {
      participantUid: string;
      senderType: number;
    },
    thunkAPI: any
  ) => {
    if (testSender?.senderType === SenderTypeInt.MIRKETPUSH) showToast('Mirket Push Notification sent to user.');

    const result = await axios.post<IParticipant>(`${apiUrl}/test-sender`, testSender);

    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const ParticipantSlice = createEntitySlice({
  name: 'participant',
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
        showToast('User Deleted Successfully.');

        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addCase(deleteEntities.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.errorMessage = null;
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
      .addMatcher(isFulfilled(getParticipantGroups), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          accountId: action.meta.arg.accountId,
          entityParticipantGroupCount: data.totalCount,
          participantGroupList: data.resultList,
          participantGroupLoading: false,
        };
      })
      .addMatcher(isFulfilled(getParticipantByGroup), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          participantByGroupList: data.resultList,
          participantByGroupLoading: false,
          participantByGroupCount: data?.totalCount,
        };
      })
      .addMatcher(isFulfilled(getParticipantBySelection), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          participantBySelectionList: data.resultList,
          participantBySelectionLoading: false,
          participantBySelectionCount: data?.totalCount,
        };
      })
      .addMatcher(isFulfilled(getParticipantExceptSelection), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          participantExceptSelectionList: data.resultList,
          participantExceptSelectionLoading: false,
          participantExceptSelectionCount: data?.totalCount,
        };
      })
      .addMatcher(isFulfilled(getParticipantExpectRule), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          participantExceptRuleList: data.resultList,
          participantExpectRuleLoading: false,
          participantExceptRuleCount: data?.totalCount,
        };
      })
      .addMatcher(isFulfilled(getParticipantByRule), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          participantByRuleList: data.resultList,
          participantByRuleLoading: false,
          participantByRuleCount: data?.totalCount,
        };
      })
      .addMatcher(isFulfilled(getParticipantExpectGroup), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          participantExceptGroupList: data.resultList,
          participantExpectGroupLoading: false,
          participantExceptGroupCount: data?.totalCount,
        };
      })
      .addMatcher(isFulfilled(createEntity), (state, action) => {
        showToast('User Created Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
      })
      .addMatcher(isFulfilled(updateEntity), (state, action) => {
        showToast('User Updated Successfully.');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.errorMessage = '';
      })
      .addMatcher(isFulfilled(onEditParticipantGroups), (state, action) => {
        showToast("User's Groups Updated Successfully!");

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(changeEntityStatus), (state, action) => {
        showToast('User Status Updated Successfully!');

        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(onExportUser), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isFulfilled(sendChangePasswordMail), (state, action) => {
        showToast('Set Password email has been sent.');

        state.errorMessage = '';
        state.sendVerificationLoading = false;
      })
      .addMatcher(isFulfilled(sendTOTP), (state, action) => {
        showToast('TOTP QR Code email has been sent.');
      })
      .addMatcher(isFulfilled(checkTOTPID), (state, action) => {
        const { data } = action.payload;
        console.log('🚀 ~ .addMatcher ~ data:', data);

        return {
          ...state,

          loading: false,
          verifyUrl: data,
        };
      })
      .addMatcher(isFulfilled(resetAllVerification), (state, action) => {
        showToast('Resend Verification email has been sent.');
        state.errorMessage = '';
        state.sendVerificationLoading = false;
      })
      .addMatcher(isFulfilled(testSend), (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
      })

      .addMatcher(isPending(testSend), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      })
      .addMatcher(
        isPending(
          createEntity,
          updateEntity,

          deleteEntity,
          deleteEntities,
          getEntities,
          getEntity,
          changeEntityStatus,
          onEditParticipantGroups,
          onExportUser
        ),
        state => {
          state.errorMessage = null;
          state.updateSuccess = false;
          state.updating = true;
          state.loading = true;
        }
      )

      .addMatcher(isPending(resetAllVerification, sendChangePasswordMail), state => {
        state.errorMessage = null;
        state.sendVerificationLoading = true;
      })
      .addMatcher(isPending(getParticipantGroups), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.participantGroupLoading = true;
      })
      .addMatcher(isPending(getParticipantByGroup), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.participantByGroupLoading = true;
      })
      .addMatcher(isPending(getParticipantExpectRule), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.participantExpectRuleLoading = true;
      })
      .addMatcher(isPending(getParticipantBySelection), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.participantBySelectionLoading = true;
      })
      .addMatcher(isPending(getParticipantExceptSelection), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.participantExceptSelectionLoading = true;
      })
      .addMatcher(isPending(getParticipantByRule), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.participantByRuleLoading = true;
      })
      .addMatcher(isPending(getParticipantExpectGroup), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
        state.participantExpectGroupLoading = true;
      })
      .addMatcher(
        isRejected(
          getEntities,
          getEntity,
          createEntity,
          updateEntity,
          sendChangePasswordMail,
          deleteEntity,
          deleteEntities,
          changeEntityStatus,
          onExportUser,
          getParticipantGroups,
          getParticipantByGroup,
          getParticipantExpectRule,
          getParticipantBySelection,
          getParticipantExceptSelection,
          getParticipantByRule,
          getParticipantExpectGroup,
          onEditParticipantGroups,
          resetAllVerification,
          testSend,
          sendTOTP,
          checkTOTPID
        ),
        (state, action) => {
          showToast(action.error.message, { type: 'error' });
          state.loading = false;
          state.sendVerificationLoading = false;
          state.updating = false;
          state.updateSuccess = false;
          state.participantGroupLoading = false;
          state.participantByGroupLoading = false;
          state.participantExpectGroupLoading = false;
          state.verifyUrl = null;
          state.verfiyErrorMessage = action.error.message;
          state.errorMessage = action.error.message;
        }
      );
  },
});

export const { reset, resetErrorMessage } = ParticipantSlice.actions;

// Reducer
export default ParticipantSlice.reducer;
