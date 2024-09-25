import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "app/config/store";
import axios, { AxiosResponse } from "axios";
import { Storage } from "app/shared/util/LocalStorage";
import { IAccountModelTemp } from "../model/AccountModel";
import {
  ALIAS,
  AUTH_TOKEN_KEY,
  KEEP_ME_SIGNED_IN,
  PORTAL,
  PROVIDERS,
  RULE_ATTRIBUTE_TYPES,
  SYSTEM_SETTINGS_KEY,
} from "../util/LocalStorage";
import { serializeSystemSettings } from "../util/SystemSettings";
import { convertClassPathsToOptions } from "../util/UtilityService";
import { serializeAxiosError } from "./reducer.utils";

export const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  showModalLogin: false,
  account: {} as IAccountModelTemp,
  errorMessage: null as unknown as string, // Errors returned from server side
  redirectMessage: null as unknown as string,
  sessionHasBeenFetched: false,
  logoutUrl: null as unknown as string,
  systemSettings: null,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Actions

export const getSession = (): AppThunk => async (dispatch, getState) => {
  await dispatch(getAccount());

  const { account } = getState().authentication;

  if (account && account.tenant && account.tenant.alias) {
    // TODO Eren api modelini değiştirdiğinde kontrol et
    Storage.local.set(ALIAS, {
      alias: account?.tenant?.alias,
      accountId: account?.tenant?.uid,
      domain: account?.tenant?.domain,
      tenantType: account?.tenant?.tenantType,
      tenantStatus: account?.tenant?.tenantStatus,
      expireDate: account?.licenceHistory?.expireDate,
      licenceType: account?.licenceHistory?.licenceType,
      licenceStatus: account?.licenceHistory?.licenceStatus,
      licenceCount: account?.licenceHistory?.totalUser,
      licenceUsage: account?.licenceHistory?.usedTotalUser,
      fullname: `${account?.firstName} ${account?.lastName}`,
      email: account?.email,
      tenantName: account?.tenant?.name,
      ownerAdminId: account?.uid,
      adminProfile: account?.adminProfile,
      adminType: account?.adminType,
      remoteSupport: account?.tenant?.isSupportActive,
      mentis: account?.tenant?.mentis,
    });
  }

  // dil desteği eklendiğinde kontrol et ve aç
  // if (account && account.langKey) {
  //   const langKey = Storage.session.get('locale', account.langKey);
  //   await dispatch(setLocale(langKey));
  // }
};

export const getAccount = createAsyncThunk(
  "authentication/get_accounts",
  async () => axios.get<IAccountModelTemp>("api/account"),
  {
    serializeError: serializeAxiosError,
  }
);

interface IAuthParams {
  username: string;
  password: string;
  mirketCode: string;
}

export const authenticate = createAsyncThunk(
  "authentication/login",
  async (auth: IAuthParams) => axios.post<any>("api/authenticate", auth),
  {
    serializeError: serializeAxiosError,
  }
);

export const login: (
  username: string,
  password: string,
  mirketCode: string,
  keepMeSignedIn: boolean
) => AppThunk =
  (username, password, mirketCode, keepMeSignedIn) => async (dispatch) => {
    const result = await dispatch(
      authenticate({ username, password, mirketCode })
    );
    const response = result.payload as AxiosResponse;
    const bearerToken = response?.headers?.authorization;

    if (response) {
      dispatch(getSession());
    }

    Storage.local.set(KEEP_ME_SIGNED_IN, keepMeSignedIn ? true : false);

    if (bearerToken && bearerToken.slice(0, 7) === "Bearer ") {
      const jwt = bearerToken.slice(7, bearerToken.length);

      if (keepMeSignedIn) {
        Storage.local.set(AUTH_TOKEN_KEY, jwt);
      } else {
        Storage.session.set(AUTH_TOKEN_KEY, jwt);
      }
    }
  };

export const clearAuthToken = () => {
  if (Storage.local.get(AUTH_TOKEN_KEY)) {
    Storage.local.remove(AUTH_TOKEN_KEY);
  }

  if (Storage.session.get(AUTH_TOKEN_KEY)) {
    Storage.session.remove(AUTH_TOKEN_KEY);
  }

  Storage.local.remove(KEEP_ME_SIGNED_IN);
  Storage.local.remove(PROVIDERS);
  Storage.local.remove(ALIAS);
  Storage.local.remove(PORTAL);
  Storage.local.remove(SYSTEM_SETTINGS_KEY);
  Storage.local.remove(RULE_ATTRIBUTE_TYPES);
};

export const logout: () => AppThunk = () => (dispatch) => {
  clearAuthToken();
  dispatch(logoutSession());
};

export const clearAuthentication = (messageKey) => (dispatch) => {
  clearAuthToken();
  dispatch(authError(messageKey));
  dispatch(clearAuth());
};

export const getSystemSettings = createAsyncThunk(
  "systemSetting/fetch_entity_list",
  async () => {
    const requestUrl = `api/system-settings`;

    return axios.get<any>(requestUrl);
  }
);

export const getSmsProviderClasspaths = createAsyncThunk(
  "smsprovider/fetch_classpath",
  async () => {
    const requestUrl = `api/otp-provider/get-provider-types`;

    return axios.get<any>(requestUrl);
  }
);
export const AuthenticationSlice = createSlice({
  name: "authentication",
  initialState: initialState as AuthenticationState,
  reducers: {
    logoutSession() {
      return {
        ...initialState,
        showModalLogin: true,
      };
    },
    authError(state, action) {
      return {
        ...state,
        showModalLogin: true,
        redirectMessage: action.payload,
      };
    },
    clearAuth(state) {
      return {
        ...state,
        loading: false,
        showModalLogin: true,
        isAuthenticated: false,
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(authenticate.rejected, (state, action) => ({
        ...initialState,
        errorMessage: action.error.message,
        showModalLogin: true,
        loginError: true,
      }))
      .addCase(authenticate.fulfilled, (state) => ({
        ...state,
        loading: false,
        loginError: false,
        showModalLogin: false,
        loginSuccess: true,
      }))
      .addCase(getAccount.rejected, (state, action) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
        sessionHasBeenFetched: true,
        showModalLogin: true,
        errorMessage: action.error.message,
      }))
      .addCase(getAccount.fulfilled, (state, action) => {
        const isAuthenticated =
          action.payload &&
          action.payload.data &&
          action.payload.data.activated;
        return {
          ...state,
          isAuthenticated,
          loading: false,
          sessionHasBeenFetched: true,
          account: action.payload.data,
        };
      })
      .addCase(authenticate.pending, (state) => {
        state.loading = true;
        state.loginError = false;
      })
      .addCase(getAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSystemSettings.fulfilled, (state, action) => {
        const settings = serializeSystemSettings(action.payload.data);
        Storage.local.set(SYSTEM_SETTINGS_KEY, settings);
      })
      .addCase(getSmsProviderClasspaths.fulfilled, (state, action) => {
        const settings = convertClassPathsToOptions(action.payload.data);
        Storage.local.set(PROVIDERS, settings);
      });
  },
});

export const { logoutSession, authError, clearAuth } =
  AuthenticationSlice.actions;

// Reducer
export default AuthenticationSlice.reducer;
