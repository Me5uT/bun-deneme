import React from 'react';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import { Route } from 'react-router-dom';
import Docs from './docs/docs';

const AdministrationRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route path="docs" element={<Docs />} />
    </ErrorBoundaryRoutes>
  </div>
);

export default AdministrationRoutes;
