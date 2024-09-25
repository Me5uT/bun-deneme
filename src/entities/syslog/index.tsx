import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import { Syslog } from './Syslog';

const SyslogSettingRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Syslog />} />
  </ErrorBoundaryRoutes>
);

export default SyslogSettingRoutes;
