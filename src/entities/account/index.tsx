import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import NotAuthorized from 'app/shared/error/NotAuthorized';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AccountDetail } from './AccountDetail';
import { AccountList } from './AccountList';

const AccountRoutes = () => {
  const [baseObj] = useMirketPortal();
  return (
    <ErrorBoundaryRoutes>
      <Route index element={<AccountList />} />
      <Route path=":id">
        {baseObj?.isReadOnly ? <Route index element={<NotAuthorized />} /> : <Route index element={<AccountDetail />} />}
      </Route>
    </ErrorBoundaryRoutes>
  );
};

export default AccountRoutes;
