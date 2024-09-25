import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import { UserPortal } from './UserPortal';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { LicenceTypeInt } from 'app/shared/model/tenant.model';
import NotAuthorized from 'app/shared/error/NotAuthorized';

const AdministratorRoutes = () => {
  const [baseObj] = useMirketPortal();

  return (
    <ErrorBoundaryRoutes>
      {baseObj?.licenceType === LicenceTypeInt.SSO ? <Route index element={<UserPortal />} /> : <Route index element={<NotAuthorized />} />}
    </ErrorBoundaryRoutes>
  );
};

export default AdministratorRoutes;
