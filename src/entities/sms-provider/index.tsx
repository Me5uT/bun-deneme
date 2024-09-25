import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import NotAuthorized from 'app/shared/error/NotAuthorized';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { SmsProviderDetail } from './SmsProviderDetail';
import { SmsProviderList } from './SmsProviderList';

const SmsProviderRoutes = () => {
  const [baseObj] = useMirketPortal();

  return (
    <ErrorBoundaryRoutes>
      <Route index element={<SmsProviderList />} />
      <Route path=":id">
        {baseObj?.isReadOnly ? <Route index element={<NotAuthorized />} /> : <Route index element={<SmsProviderDetail />} />}
      </Route>
    </ErrorBoundaryRoutes>
  );
};

export default SmsProviderRoutes;
