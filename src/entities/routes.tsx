import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { Loader } from 'app/shared/components/Loader';
// import PageNotFound from 'app/shared/error/page-not-found';
// import Accounts from './account';
// import AdministratorsTempRoutes from './administration';
// import AttributeProfile from './attribute-profile';
// import LdapGroupTempRoutes from './external-source';
// import GatewayLdap from './gateway-ldap';
// import GatewayRadius from './gateway-radius';
// import GroupTempRoutes from './group';
// import LoggingAuditRoutes from './logging-audit';
// import LoggingRadiusRoutes from './logging-radius';
// import MentisRoutes from './mentis';
// import RadiusRuleTempRoutes from './radius-rule';
// import SmsProvider from './sms-provider';
// import SyslogSettingRoutes from './syslog';
// import TenantSettingRoutes from './tenant-setting';
// import UserTempRoutes from './user';
// import UserPortalRoutes from './user-portal';

/* jhipster-needle-add-route-import - JHipster will add routes here */
// lazy loading kullanarak importları düzenle
const PageNotFound = React.lazy(() => import('app/shared/error/page-not-found'));
const LazyAccounts = React.lazy(() => import('./account'));
const LazyAdministratorsTempRoutes = React.lazy(() => import('./administration'));
const LazyAttributeProfile = React.lazy(() => import('./attribute-profile'));
const LazyLdapGroupTempRoutes = React.lazy(() => import('./external-source'));
const LazyGatewayLdap = React.lazy(() => import('./gateway-ldap'));
const LazyGatewayRadius = React.lazy(() => import('./gateway-radius'));
const LazyGroupTempRoutes = React.lazy(() => import('./group'));
const LazyLoggingAuditRoutes = React.lazy(() => import('./logging-audit'));
const LazyLoggingRadiusRoutes = React.lazy(() => import('./logging-radius'));
const LazyMentisRoutes = React.lazy(() => import('./mentis'));
const LazyRadiusRuleTempRoutes = React.lazy(() => import('./radius-rule'));
const LazySmsProvider = React.lazy(() => import('./sms-provider'));
const LazySyslogSettingRoutes = React.lazy(() => import('./syslog'));
const LazyTenantSettingRoutes = React.lazy(() => import('./tenant-setting'));
const LazyUserTempRoutes = React.lazy(() => import('./user'));
const LazyUserPortalRoutes = React.lazy(() => import('./user-portal'));

export default () => {
  const [baseObj] = useMirketPortal();

  return (
    <div className="content-container-inner">
      <Suspense fallback={<Loader />}>
        <ErrorBoundaryRoutes>
          <Route path={`${baseObj?.basePath}/accounts/*`} element={<LazyAccounts />} />
          <Route path={`${baseObj?.basePath}/sms-provider/*`} element={<LazySmsProvider />} />
          <Route path={`${baseObj?.basePath}/gateway-radius/*`} element={<LazyGatewayRadius />} />
          <Route path={`${baseObj?.basePath}/gateway-ldap/*`} element={<LazyGatewayLdap />} />
          <Route path={`${baseObj?.basePath}/user/*`} element={<LazyUserTempRoutes />} />
          <Route path={`${baseObj?.basePath}/group/*`} element={<LazyGroupTempRoutes />} />
          <Route path={`${baseObj?.basePath}/administration/*`} element={<LazyAdministratorsTempRoutes />} />
          <Route path={`${baseObj?.basePath}/attribute-profile/*`} element={<LazyAttributeProfile />} />
          <Route path={`${baseObj?.basePath}/radius-rules/*`} element={<LazyRadiusRuleTempRoutes />} />
          <Route path={`${baseObj?.basePath}/external-source/*`} element={<LazyLdapGroupTempRoutes />} />
          <Route path={`${baseObj?.basePath}/tenant-setting/*`} element={<LazyTenantSettingRoutes />} />
          <Route path={`${baseObj?.basePath}/syslog/*`} element={<LazySyslogSettingRoutes />} />
          <Route path={`${baseObj?.basePath}/logging-audit/*`} element={<LazyLoggingAuditRoutes />} />
          <Route path={`${baseObj?.basePath}/logging-radius/*`} element={<LazyLoggingRadiusRoutes />} />
          <Route path={`${baseObj?.basePath}/mentis-manage/*`} element={<LazyMentisRoutes />} />
          <Route path={`${baseObj?.basePath}/user-portal`} element={<LazyUserPortalRoutes />} />

          <Route path={`*`} element={<PageNotFound />} />
        </ErrorBoundaryRoutes>
      </Suspense>
    </div>
  );
};
