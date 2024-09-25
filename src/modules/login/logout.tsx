import React, { useLayoutEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { Button, Card, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
  const logoutUrl = useAppSelector(state => state.authentication.logoutUrl);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    dispatch(logout());
    if (logoutUrl) {
      window.location.href = logoutUrl;
    }
  });

  return (
    <div className="logout-container">
      <Result
        status="success"
        title="Logout Successful!"
        subTitle="To log in again, please click the 'Login' button."
        style={{
          width: 500,
          height: 500,
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px',
        }}
        extra={[
          <Button
            key={'login'}
            type="default"
            onClick={() => {
              navigate('/login');
            }}
          >
            Login
          </Button>,
        ]}
      />
    </div>
  );
};

export default Logout;
