import { AUTHORITIES } from 'app/config/constants';
import React, { lazy, Suspense } from 'react';
import { Route, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from './config/store';
import { Loader } from './shared/components/Loader';
import useMirketPortal from './shared/hooks/useMirketPortal';
import { ActivationToken } from './entities/activation-token/ActivationUrl';
import TOTPQRCode from './entities/totp-qrcode/TOTPQRCode';

// Use lazy loading for components
const EntitiesRoutes = lazy(() => import('app/entities/routes'));
const Admin = lazy(() => import('app/modules/administration'));
const Home = lazy(() => import('app/entities/dashboard/Dashboard'));
const Login = lazy(() => import('app/modules/login/login'));
const Logout = lazy(() => import('app/modules/login/logout'));
const PrivateRoute = lazy(() => import('app/shared/auth/private-route'));
const ErrorBoundaryRoutes = lazy(() => import('app/shared/error/error-boundary-routes'));
const PageNotFound = lazy(() => import('app/shared/error/page-not-found'));
const ActivationUrl = lazy(() => import('app/entities/activation-url/ActivationUrl'));
const ChangePassword = lazy(() => import('app/entities/change-password/ChangePassword'));

interface IAppRoutesProps {
  setLoc?: (v: any) => void;
}

const AppRoutes: React.FC<IAppRoutesProps> = ({ setLoc }) => {
  const loc = useLocation();
  const [baseObj] = useMirketPortal();
  const navigate = useNavigate();
  const isAuthenticated: boolean = useAppSelector(state => state.authentication.isAuthenticated);

  React.useEffect(() => {
    setLoc(loc);

    if (isAuthenticated && (loc.pathname === '/' || loc.pathname === '')) {
      navigate(baseObj?.basePath);
    }
  }, [loc]);

  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundaryRoutes>
        <Route path="verify" element={<ActivationUrl />} />
        <Route path="change-password" element={<ChangePassword />} />

        <Route path="totp-qrcode" element={<TOTPQRCode />} />
        <Route path="token" element={<ActivationToken />} />

        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />

        {isAuthenticated && <Route index element={<Home />} />}
        {isAuthenticated && <Route path={`${baseObj?.basePath}`} element={<Home />} />}

        <Route
          path={'*'}
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
              <EntitiesRoutes />
            </PrivateRoute>
          }
        />

        <Route
          path="admin/*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </ErrorBoundaryRoutes>
    </Suspense>
  );
};

export default AppRoutes;
