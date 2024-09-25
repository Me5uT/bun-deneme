import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import { GeneralSettings } from './GeneralSettings';

const TenantSettingRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<GeneralSettings />} />
  </ErrorBoundaryRoutes>
);

export default TenantSettingRoutes;
