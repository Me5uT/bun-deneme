import { Button, Result } from 'antd';
import React from 'react';
import useMirketPortal from '../hooks/useMirketPortal';
import { useLocation, useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const [baseObj] = useMirketPortal();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPathname = location?.pathname?.split('/')[1];

  return (
    <div>
      <Result
        status={currentPathname === baseObj?.basePath ? '404' : '403'}
        title={currentPathname === baseObj?.basePath ? '404' : '403'}
        subTitle={
          currentPathname === baseObj?.basePath
            ? 'Sorry, the page you visited does not exist.'
            : 'Sorry, no permission to access this page.'
        }
        extra={
          <Button
            type="primary"
            onClick={() => {
              navigate(`/${baseObj?.basePath}`);
            }}
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
};

export default PageNotFound;
