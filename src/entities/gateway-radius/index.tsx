import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import NotAuthorized from 'app/shared/error/NotAuthorized';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { GatewayDetail } from './GatewayDetail';
import { GatewayRadiusList } from './GatewayRadiusList';

const GatewayRadiusRoutes = () => {
  const [baseObj] = useMirketPortal();
  return (
    <ErrorBoundaryRoutes>
      <Route index element={<GatewayRadiusList />} />
      <Route path=":id">
        {baseObj?.isReadOnly ? <Route index element={<NotAuthorized />} /> : <Route index element={<GatewayDetail />} />}
      </Route>
    </ErrorBoundaryRoutes>
  );
};

export default GatewayRadiusRoutes;
