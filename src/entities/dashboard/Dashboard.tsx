import { Col, Row, Space, Tag } from "antd";
import { useAppDispatch, useAppSelector } from "app/config/store";
import { DashboardCard } from "app/shared/components/DashboardCard";
import { DashboardCard2 } from "app/shared/components/DashboardCard2";
import useMirketPortal from "app/shared/hooks/useMirketPortal";
import { IDashboardDetail } from "app/shared/model/DashboardModel";
import { ILocalStoragePortalModel } from "app/shared/model/LocalStorage.model";
import { LicenceStatusInt, TenantTypeInt } from "app/shared/model/tenant.model";
import { PORTAL } from "app/shared/util/LocalStorage";
import {
  getColorByType,
  getTimeZoneLabel,
} from "app/shared/util/UtilityService";
import { formatDate } from "app/shared/util/date-utils";
import React from "react";
import { Storage } from "app/shared/util/LocalStorage";
import { AuthenticationStatusChart } from "./charts/AuthenticationStatusChart";
import { TopUserCharts } from "./charts/TopUserCharts";
import { getDashboardDetail } from "./dashboard.reducer";

export const Home = () => {
  const [baseObj] = useMirketPortal();
  const dispatch = useAppDispatch();

  const dashboardDetail: IDashboardDetail = useAppSelector(
    (state) => state.dashboard.dashboardDetail
  );
  const loading: boolean = useAppSelector(
    (state) => state.dashboard.dashboardDetailLoading
  );

  // localdeki portal verileri
  const portals: ILocalStoragePortalModel[] = React.useMemo(
    () => Storage.local.get(PORTAL) || [],
    [location]
  );

  // location.pathname'i içeren portal objesini bul
  const matchingPortal: ILocalStoragePortalModel | undefined = React.useMemo(
    () => portals.find((p) => location.pathname.includes(p.portal)),
    []
  );

  const licenceItems = React.useMemo(
    () => [
      {
        key: "1",
        label: "Licence Status",
        children: (
          <Tag
            color={getColorByType(
              LicenceStatusInt,
              dashboardDetail?.licenceHistory?.licenceStatus
            )}
          >
            {`${
              Object.values(LicenceStatusInt)[
                dashboardDetail?.licenceHistory?.licenceStatus
              ]
            }`}
          </Tag>
        ),
      },

      {
        key: "2",
        label: "Licence Count",
        children: dashboardDetail?.licenceHistory?.totalUser,
      },
      {
        key: "3",
        label: "Licence Usage",
        children: dashboardDetail?.licenceHistory?.usedTotalUser,
      },

      {
        key: "4",
        label: "Licence Expire Date",
        children: formatDate(dashboardDetail?.licenceHistory?.expireDate),
      },
    ],
    [dashboardDetail]
  );

  const portalItems = React.useMemo(
    () => [
      {
        key: "6",
        label: "Admins",
        children: dashboardDetail?.portal?.adminCount,
        // icon: <AdminIcon />,
      },
      {
        key: "7",
        label: "Online / Total Gateway",
        children: `${dashboardDetail?.portal?.onlineGatewayCount} / ${dashboardDetail?.portal?.totalGatewayCount}`,
        // icon: <GatewayIcon />,
      },

      {
        key: "9",
        label: "Pending Status",
        children: dashboardDetail?.portal?.pendingParticipantCount,
        // icon: <FontAwesomeIcon icon={'hourglass-end'} style={{ marginBottom: '10px', fontSize: '1.1rem' }} />,
      },
      {
        key: "29",
        label: "Users",
        children: dashboardDetail?.portal?.totalParticipantCount,
        // icon: <FontAwesomeIcon icon={'user'} style={{ marginBottom: '10px', fontSize: '1.1rem' }} />,
      },
      {
        key: "199",
        label: "Groups",
        children: dashboardDetail?.portal?.totalGroupCount,
        // icon: <FontAwesomeIcon icon={'users-viewfinder'} style={{ marginBottom: '10px', fontSize: '1.1rem' }} />,
      },
    ],
    [dashboardDetail]
  );

  const generalItems = React.useMemo(
    () => [
      {
        key: "10",
        label: "Company Name",
        children: dashboardDetail?.tenant?.name,
      },
      {
        key: "11",
        label: "Account Type",
        children: (
          <Tag
            color={getColorByType(
              TenantTypeInt,
              dashboardDetail?.tenant?.tenantType
            )}
          >
            {`${
              Object.values(TenantTypeInt)[dashboardDetail?.tenant?.tenantType]
            }`}
          </Tag>
        ),
      },
      {
        key: "12",
        label: "Version",
        children: `M${dashboardDetail?.tenant?.version?.id}.0`,
      },

      {
        key: "13",
        label: "Time Zone",
        children: getTimeZoneLabel(dashboardDetail?.timezone),
      },
    ],
    [dashboardDetail]
  );

  React.useEffect(() => {
    dispatch(getDashboardDetail(baseObj?.accountId));
  }, [baseObj?.accountId]);

  return (
    <div className="home-container">
      <Space direction="vertical" style={{ width: "100%" }} size={10}>
        <DashboardCard
          title="General"
          items={generalItems}
          loading={
            loading ||
            (matchingPortal && matchingPortal.remoteSupport === false)
          }
        />

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <DashboardCard
              title="Licence"
              items={licenceItems}
              loading={
                loading ||
                (matchingPortal && matchingPortal.remoteSupport === false)
              }
            />
          </Col>
          <Col span={12}>
            <DashboardCard2
              title="Portal"
              items={portalItems}
              loading={
                loading ||
                (matchingPortal && matchingPortal.remoteSupport === false)
              }
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <AuthenticationStatusChart />
          </Col>
          <Col span={12}>
            <TopUserCharts />
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default Home;
