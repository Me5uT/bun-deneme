import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import NotAuthorized from 'app/shared/error/NotAuthorized';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { GroupDetail } from './GroupDetail';
import { GroupList } from './GroupList';

const GroupTempRoutes = () => {
  const [baseObj] = useMirketPortal();

  return (
    <ErrorBoundaryRoutes>
      <Route index element={<GroupList />} />
      <Route path=":id">
        {baseObj?.isReadOnly ? <Route index element={<NotAuthorized />} /> : <Route index element={<GroupDetail />} />}
      </Route>
    </ErrorBoundaryRoutes>
  );
};

export default GroupTempRoutes;
