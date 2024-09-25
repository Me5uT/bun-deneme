import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import NotAuthorized from 'app/shared/error/NotAuthorized';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { AttributeProfileDetail } from './AttributeProfileDetail';
import { AttributeProfileList } from './AttributeProfileList';

const AttributeProfileRoutes = () => {
  const [baseObj] = useMirketPortal();

  return (
    <ErrorBoundaryRoutes>
      <Route index element={<AttributeProfileList />} />
      <Route path=":id">
        {baseObj?.isReadOnly ? <Route index element={<NotAuthorized />} /> : <Route index element={<AttributeProfileDetail />} />}
      </Route>
    </ErrorBoundaryRoutes>
  );
};

export default AttributeProfileRoutes;
