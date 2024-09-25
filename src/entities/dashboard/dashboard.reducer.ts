import { createAsyncThunk, isPending, isRejected } from '@reduxjs/toolkit';
import { IDashboardDetail, IDashboardGraphic, IDashboardTopUser } from 'app/shared/model/DashboardModel';
import { EntityState, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';

const initialState: EntityState<IDashboardDetail> = {
  loading: false,
  dashboardTopUserLoading: false,
  dashboardTopUsers: [],
  dashboardGraphicLoading: false,
  dashboardGraphic: [],
  dashboardDetailLoading: true,
  dashboardMostParticipantLoading: true,
  dashboardDetail: {} as IDashboardDetail,
  errorMessage: null,
  updating: false,
  updateSuccess: false,
  deleteSuccess: false,
  createSuccess: false,
};

const apiUrl = 'api/dashboard';

// Actions

export const getDashboardDetail = createAsyncThunk(
  'dashboard/fetch_dashboard',
  async (id: string) => {
    const requestUrl = `${apiUrl}/detail`;
    return axios.get<IDashboardDetail>(requestUrl, {
      params: { accountId: id },
    });
  },
  { serializeError: serializeAxiosError }
);

export const getDashboarTopUsers = createAsyncThunk(
  'dashboard/fetch_top_users',
  async ({ accountId, status, type }: { accountId: string; status: number; type: number }) => {
    const requestUrl = `${apiUrl}/top-users`;
    return axios.get<IDashboardTopUser>(requestUrl, {
      params: { accountId, status, type },
    });
  },
  { serializeError: serializeAxiosError }
);

export const getDashboardGraphic = createAsyncThunk(
  'dashboard/fetch_graphic',
  async ({ accountId, period, day, type }: { accountId: string; period: number; day: number; type: number }) => {
    const requestUrl = `${apiUrl}/graphics`;
    return axios.get<IDashboardGraphic>(requestUrl, {
      params: { accountId, period, day, type },
    });
  },
  { serializeError: serializeAxiosError }
);

// slice

export const DashboardSlice = createEntitySlice({
  name: 'dashboard',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getDashboarTopUsers.fulfilled, (state, action) => {
        state.dashboardTopUserLoading = false;
        state.dashboardTopUsers = action.payload.data?.topList;
      })
      .addCase(getDashboardGraphic.fulfilled, (state, action) => {
        state.dashboardGraphicLoading = false;
        state.dashboardGraphic = action.payload.data as any;
      })
      .addCase(getDashboardDetail.fulfilled, (state, action) => {
        state.dashboardDetailLoading = false;
        state.dashboardDetail = action.payload.data as any;
      })
      .addMatcher(isPending(getDashboardDetail), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.dashboardDetailLoading = true;
      })
      .addMatcher(isPending(getDashboarTopUsers), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.dashboardTopUserLoading = true;
        state.dashboardTopUsers = [];
      })
      .addMatcher(isPending(getDashboardGraphic), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.dashboardGraphicLoading = true;
        state.dashboardGraphic = [];
      })
      .addMatcher(isRejected(getDashboardDetail, getDashboarTopUsers, getDashboardGraphic), (state, action) => {
        state.dashboardMostParticipantLoading = false;
        state.dashboardTopUserLoading = false;
        state.dashboardDetailLoading = false;
        state.dashboardGraphicLoading = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset } = DashboardSlice.actions;

// Reducer
export default DashboardSlice.reducer;
