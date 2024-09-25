import { Button, Result } from 'antd';
import React from 'react';
import useMirketPortal from '../hooks/useMirketPortal';
import { useNavigate } from 'react-router-dom';

const NotAuthorized = () => {
  const [baseObj] = useMirketPortal();
  const navigate = useNavigate();

  return (
    <div>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
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

export default NotAuthorized;
