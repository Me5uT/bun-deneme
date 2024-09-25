import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import NotAuthorized from 'app/shared/error/NotAuthorized';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { ExternalSourceDetail } from './ExternalSourceDetail';
import { ExternalSourceList } from './ExternalSourceList';
import { ExternalSourceReport } from './ExternalSourceReport';

const LdapGroupTempRoutes = () => {
  const [baseObj] = useMirketPortal();

  return (
    <ErrorBoundaryRoutes>
      <Route index element={<ExternalSourceList />} />
      <Route path="report">
        {baseObj?.isReadOnly ? <Route index element={<NotAuthorized />} /> : <Route index element={<ExternalSourceReport />} />}
      </Route>
      <Route path=":id">
        {baseObj?.isReadOnly ? <Route index element={<NotAuthorized />} /> : <Route index element={<ExternalSourceDetail />} />}
      </Route>
    </ErrorBoundaryRoutes>
  );
};

export default LdapGroupTempRoutes;
