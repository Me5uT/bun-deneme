import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import NotAuthorized from 'app/shared/error/NotAuthorized';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { ManageList } from './manage/ManageList';

const MentisRoutes = () => {
  const [baseObj] = useMirketPortal();

  return (
    <ErrorBoundaryRoutes>
      {baseObj?.isReadOnly || !baseObj?.mentis ? <Route index element={<NotAuthorized />} /> : <Route index element={<ManageList />} />}
    </ErrorBoundaryRoutes>
  );
};

export default MentisRoutes;
