/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import "react-phone-input-2/lib/high-res.css";
import "react-toastify/dist/ReactToastify.css";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Storage } from "./shared/util/LocalStorage";
import { Button, Layout, Menu } from "antd";
import { useAppDispatch, useAppSelector } from "./config/store";
import AppRoutes from "./routes";
import ErrorBoundary from "./shared/error/error-boundary";
import AppHeader from "./shared/layout/header/header";
import { getSession } from "./shared/reducers/authentication";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { DeleteDialog } from "./shared/components/DeleteDialog";
import DynamicBreadcrumb from "./shared/components/DynamicBreadcrumb";
import OrientationAlert from "./shared/components/OrientationAlert";
import useMirketPortal from "./shared/hooks/useMirketPortal";
import AppFooter from "./shared/layout/footer/footer";
import { AdminTypeInt } from "./shared/model/AdminModel";
import { ILocalStoragePortalModel } from "./shared/model/LocalStorage.model";
import { TenantTypeInt } from "./shared/model/tenant.model";
import { PORTAL } from "./shared/util/LocalStorage";

// DAYJS CONFIGURATION
dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
// let baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');
const { Header, Content, Footer, Sider } = Layout;
export const App = () => {
  const [sideBarCollapsed, setSideBarCollapsed] = React.useState<boolean>(true);
  const [hideSidebar, setHideSidebar] = React.useState<boolean>(true);
  const [hideHeader, setHideHeader] = React.useState<boolean>(true);
  const [hideBreadcrumb, setHideBreadcrumb] = React.useState<boolean>(true);
  const [loc, setLoc] = React.useState<any>(null); // useLocation();

  const dispatch = useAppDispatch();
  const [baseObj] = useMirketPortal();

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
  // const clearMatchingPortal = React.useCallback(() => {
  //   const filteredPortals = portals.filter(p => p.portal !== matchingPortal?.portal);
  //   Storage.local.set(PORTAL, filteredPortals);
  // }, [location.pathname]);

  // console.log('🚀 ~ App ~ matchingPortal:', matchingPortal);

  // const keepMeSignedIn = React.useMemo(() => Storage.local.get(KEEP_ME_SIGNED_IN), []);
  // const jwt = React.useMemo(() => Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY), []);

  const isAuthenticated = useAppSelector(
    (state) => state.authentication.isAuthenticated
  );
  // const currentLocale = useAppSelector(state => state.locale.currentLocale);
  // const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  // const ribbonEnv = useAppSelector(state => state.applicationProfile.ribbonEnv);
  // const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  // const isOpenAPIEnabled = useAppSelector(state => state.applicationProfile.isOpenAPIEnabled);

  React.useEffect(() => {
    dispatch(getSession());
  }, []);

  React.useEffect(() => {
    if (matchingPortal !== undefined)
      document.title = `Mirket Portal - ${baseObj?.basePath}`;

    if (
      !isAuthenticated ||
      baseObj?.tenantType === TenantTypeInt.ENDUSER ||
      baseObj?.adminType === AdminTypeInt.ACCOUNT_ADMIN
    ) {
      setHideSidebar(true);
    } else {
      setHideSidebar(false);
    }

    if (
      !isAuthenticated ||
      loc?.pathname?.includes("change-password") ||
      loc?.pathname?.includes("verify") ||
      loc?.pathname?.includes("totp-qrcode") ||
      loc?.pathname?.includes("token")
    ) {
      setHideSidebar(true);
      setHideHeader(true);
      setHideBreadcrumb(true);
    } else {
      setHideHeader(false);
      setHideBreadcrumb(false);
    }
  }, [loc, isAuthenticated, baseObj]);

  return (
    <BrowserRouter basename={""}>
      <ToastContainer />
      <Layout>
        <Header hidden={hideHeader}>
          <AppHeader />
        </Header>

        <Layout hasSider>
          <Sider
            className="custom-sidebar"
            hidden={hideSidebar}
            trigger={null}
            breakpoint="lg"
            width={150}
            onBreakpoint={(broken) => {}}
            defaultCollapsed={true}
            collapsible={true}
            collapsed={sideBarCollapsed}
            collapsedWidth={0}
          >
            <div style={{ display: "block" }}>
              <Button
                onClick={() => {
                  setSideBarCollapsed((prev) => !sideBarCollapsed);
                }}
                style={{
                  display: "block",
                  position: "absolute",
                  right: "-25px",
                  top: "100px",
                  transform: "translateY(-50%)",
                  backgroundColor: "white",
                  zIndex: 2,
                }}
                icon={
                  sideBarCollapsed ? (
                    <ArrowRightOutlined
                      className="open-sidebar-icon"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ) : (
                    <ArrowLeftOutlined
                      className="close-sidebar-icon"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )
                }
              />
            </div>
            <Menu
              theme="light"
              mode="inline"
              style={{
                paddingLeft: "0px",
                minHeight: "auto",
              }}
              items={[
                {
                  key: "2",
                  label: (
                    <Link
                      id={"menu-item-accountlist"}
                      to={`/${baseObj?.basePath}/accounts`}
                    >
                      <b>{"Account List"}</b>
                    </Link>
                  ),
                },
              ]}
            />
          </Sider>
          <Content
            className={`${sideBarCollapsed ? "" : "blurred"} ${
              isAuthenticated ? "content-container" : ""
            }`}
          >
            {!hideBreadcrumb && <DynamicBreadcrumb />}
            <ErrorBoundary>
              <AppRoutes setLoc={setLoc} />
            </ErrorBoundary>
          </Content>
        </Layout>
        <Footer hidden={true}>
          <AppFooter />
        </Footer>
      </Layout>
      <OrientationAlert />

      <DeleteDialog
        width={400}
        destroyOnClose
        title="This account's Remote Support is off!"
        type="danger"
        // title="Do you  want to delete this account?"
        open={matchingPortal && matchingPortal.remoteSupport === false}
        okText={"Quit"}
        okType="danger"
        iconFade={true}
        centered
        closeIcon={false}
        footer={
          <Button type="default" danger block onClick={() => window.close()}>
            Quit
          </Button>
        }
      />
    </BrowserRouter>
  );
};

export default App;
