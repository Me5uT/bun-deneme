import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import NotAuthorized from 'app/shared/error/NotAuthorized';
import useMirketPortal from 'app/shared/hooks/useMirketPortal';
import { RadiusRuleDetail } from './RadiusRuleDetail';
import { RadiusRuleList } from './RadiusRuleList';

const RadiusRuleTempRoutes = () => {
  const [baseObj] = useMirketPortal();
  return (
    <ErrorBoundaryRoutes>
      <Route index element={<RadiusRuleList />} />
      <Route path=":id">
        {baseObj?.isReadOnly ? <Route index element={<NotAuthorized />} /> : <Route index element={<RadiusRuleDetail />} />}
      </Route>
    </ErrorBoundaryRoutes>
  );
};

export default RadiusRuleTempRoutes;
