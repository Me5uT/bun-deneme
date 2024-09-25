import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { LoggingRadiusList } from './LoggingRadiusList';

const LoggingRadiusRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<LoggingRadiusList />} />
  </ErrorBoundaryRoutes>
);

export default LoggingRadiusRoutes;
