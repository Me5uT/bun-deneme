import React from 'react';
import { Breadcrumb, Radio, RadioChangeEvent, Space } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useMirketPortal from '../hooks/useMirketPortal';

const DynamicBreadcrumb: React.FC = () => {
  const breadcrumbNameMap = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/docs': 'API List',

    '/tenant-setting': 'Settings',
    '/syslog': 'SysLog',

    '/accounts': 'Account List',
    '/accounts/:id': 'Account Detail',

    '/administration': 'Admin List',
    '/administration/:id': 'Admin Detail',

    '/user': 'User List',
    '/user/:id': 'User Detail',

    '/group': 'Group List',
    '/group/:id': 'Group Detail',

    '/radius-rules': 'Radius Rules',
    '/radius-rules/:id': 'Radius Rule Detail',

    // '/portal-rules': 'Portal Rules',
    // '/portal-rules/:id': 'Portal Rule Detail',

    '/user-portal': 'User Portal',
    // '/user-portal/:id': 'User Portal Detail',

    '/sms-provider': 'Sms Provider List',
    '/sms-provider/:id': 'Sms Provider Detail',

    '/attribute-profile': 'Attribute Profile List',
    '/attribute-profile/:id': 'Attribute Profile Detail',

    '/gateway-radius': 'Gateway List',
    '/gateway-radius/:id': 'Gateway Detail',

    '/gateway-ldap': 'Gateway List',
    '/gateway-ldap/:id': 'Gateway Detail',

    '/external-source': 'External Source List',
    '/external-source/report': 'External Source Report',
    '/external-source/:id': 'External Source Detail',

    '/logging-audit': 'Audit Logs',
    '/logging-radius': 'Radius Logs',

    '/mentis-manage': 'Manage',
    // '/mentis-detection': 'Detection',

    // ssp pages will be deleted
    // '/ssp-login': 'Login',
    // '/ssp-dashboard': 'Dashboard',
    // '/ssp-settings': 'My Settings',
  };

  const [switchRouter, setSwitchRouter] = React.useState<any>(null);
  const [baseObj] = useMirketPortal();
  const location = useLocation();
  const navigate = useNavigate();
  // Bu fonksiyon, dinamik rotalar için breadcrumb adını çıkarır.
  const getBreadcrumbItem = (pathname: string, breadcrumbNameMaps: Record<string, string>) => {
    let breadcrumbName: string | undefined;

    // Statik rotaları kontrol et
    breadcrumbName = breadcrumbNameMaps[pathname];

    // Dinamik rotaları kontrol et
    if (!breadcrumbName) {
      for (const pattern in breadcrumbNameMaps) {
        if (pattern.includes(':')) {
          const regex = new RegExp(`^${pattern.replace(/:[^\s/]+/g, '([\\w-]+)')}$`);
          if (pathname.match(regex)) {
            breadcrumbName = breadcrumbNameMaps[pattern];
            break;
          }
        }
      }
    }

    return breadcrumbName || 'Unknown Page';
  };

  const breadcrumbItems = React.useMemo(() => {
    // URL'deki ilk bölümü atla
    const pathSnippets = location.pathname.split('/').filter((i, index) => i && index !== 1);
    const items = [{ title: 'Home', href: '/', isLink: true }];

    for (let i = 0; i < pathSnippets.length; i++) {
      const path = `/${pathSnippets.slice(0, i + 1).join('/')}`;
      const breadcrumbName = getBreadcrumbItem(path, breadcrumbNameMap);
      const isLast = i === pathSnippets.length - 1;
      items.push({ title: breadcrumbName, href: path, isLink: !isLast });
    }

    return items;
  }, [location.pathname]);

  const breadcrumbElements = breadcrumbItems.map((item, index) => {
    const content = item.isLink ? <Link to={`/${baseObj?.basePath}${item.href}`}>{item.title}</Link> : <b>{item.title}</b>;
    return { title: content, key: item.title };
  });

  const getActiveSwitch = () => {
    switch (true) {
      case location.pathname.includes('logging-audit'):
        return 'audit';
      case location.pathname.includes('logging-radius'):
        return 'radius';
      case location.pathname.includes('gateway-radius'):
        return 'gateway-radius';
      case location.pathname.includes('gateway-ldap'):
        return 'gateway-ldap';

      default:
        break;
    }
  };

  React.useEffect(() => {
    setSwitchRouter(getActiveSwitch());
  }, [location.pathname]);

  return (
    <Space
      direction="horizontal"
      align="center"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        flexDirection: 'row',
        paddingBottom: '15px',
        alignItems: 'center',
      }}
    >
      <Breadcrumb items={breadcrumbElements} className="breadcrumb" separator={'-'} />
      {location.pathname.includes('logging') && (
        <Radio.Group
          value={switchRouter}
          buttonStyle="solid"
          onChange={(e: RadioChangeEvent) => {
            setSwitchRouter(e.target.value);
          }}
        >
          <Radio.Button
            className="audit-logging-radio-button"
            value={'audit'}
            onClick={() => {
              navigate(`/${baseObj?.basePath}/logging-audit`);
            }}
          >
            Audit
          </Radio.Button>
          <Radio.Button
            className="radius-logging-radio-button"
            value={'radius'}
            onClick={() => {
              navigate(`/${baseObj?.basePath}/logging-radius`);
            }}
          >
            Radius
          </Radio.Button>
        </Radio.Group>
      )}
      {location.pathname.includes('gateway') && (
        <Radio.Group
          value={switchRouter}
          buttonStyle="solid"
          onChange={(e: RadioChangeEvent) => {
            setSwitchRouter(e.target.value);
          }}
        >
          <Radio.Button
            className="audit-logging-radio-button"
            value={'gateway-radius'}
            onClick={() => {
              navigate(`/${baseObj?.basePath}/gateway-radius`);
            }}
          >
            Radius
          </Radio.Button>
          <Radio.Button
            className="radius-logging-radio-button"
            value={'gateway-ldap'}
            onClick={() => {
              navigate(`/${baseObj?.basePath}/gateway-ldap`);
            }}
          >
            LDAP
          </Radio.Button>
        </Radio.Group>
      )}
    </Space>
  );
};

export default React.memo(DynamicBreadcrumb);
