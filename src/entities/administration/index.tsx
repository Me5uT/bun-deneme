import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import NotAuthorized from 'app/shared/error/NotAuthorized';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AdminDetail } from './AdminDetail';
import { AdminList } from './AdminList';

const AdministratorRoutes = () => {
  const [baseObj] = useMirketPortal();

  return (
    <ErrorBoundaryRoutes>
      <Route index element={<AdminList />} />
      <Route path=":id">
        {baseObj?.isReadOnly ? <Route index element={<NotAuthorized />} /> : <Route index element={<AdminDetail />} />}
      </Route>
    </ErrorBoundaryRoutes>
  );
};

export default AdministratorRoutes;
