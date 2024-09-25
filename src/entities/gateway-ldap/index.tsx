import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import NotAuthorized from 'app/shared/error/NotAuthorized';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { GatewayDetail } from './GatewayDetail';
import { GatewayLdapList } from './GatewayLdapList';

const GatewayLdapRoutes = () => {
  const [baseObj] = useMirketPortal();

  return (
    <ErrorBoundaryRoutes>
      <Route index element={<GatewayLdapList />} />
      <Route path=":id">
        {baseObj?.isReadOnly ? <Route index element={<NotAuthorized />} /> : <Route index element={<GatewayDetail />} />}
      </Route>
    </ErrorBoundaryRoutes>
  );
};

export default GatewayLdapRoutes;
