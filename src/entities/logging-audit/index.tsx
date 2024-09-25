import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { LoggingAuditList } from './LoggingAuditList';

const LoggingAuditRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<LoggingAuditList />} />
    {/* <Route path=":id"><Route index element={<AdminDetail />} /></Route> */}
  </ErrorBoundaryRoutes>
);

export default LoggingAuditRoutes;
