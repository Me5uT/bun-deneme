export interface IAuditLogModel {
  id: number;
  uid: string;
  apiname: string;
  user: string;
  level: LogLevel; // log level
  sourceip: string;
  responseStatus: number; // http status
  createdDate: string;
  message: string;
  messageWithObject: string;
  messageWithoutObject: string;
  sentparams: string;
  object?: string;
  browserheader: string;
  createdOn: string | null;
  isActive: boolean;
  isDeleted: boolean;
  logtype: string;
  tenant: string | null;
  updatedDate: string;
  updatedOn: string | null;
  displayParams?: string;
}

export interface IRadiusLogModel {
  uid: string;
  username: string;
  result: string;
  samName: string;
  samValue: string;
  time: Date | string;
  gatewayName: string;
  radiusClientName: string;
  message: string;
  endUserIp: string;
  souceCountry: string;
  ruleName: string;
  authenticaitonResult: string;
  firstAuthenticaitonResult: boolean;
  secondAuthenticationResult: boolean;
  authenticaitonMethod: string;
}
export enum RadiusStatus {
  SUCCESS,
  FAILURE,
  WAITING,
  NONE,
  DENIED,
}
export enum LogLevel {
  CONFIG,
  INFO,
  WARNING,
}

export enum LogType {
  CONFIGURATION_CHANGED = 'Configuration changed',
  LOGON = 'Logon',
  PASSWORD = 'Password',
}

export const LogMessages = [
  // Login log message
  {
    value: 'Admin has logined.',
    label: 'Admin has logined.',
  },
  // Settings log messages
  {
    value: 'Setting configuration is changed in the admin session.',
    label: 'Setting configuration is changed in the admin session.',
  },
  {
    value: 'Password has been reseted via forget password process.',
    label: 'Password has been reseted via forget password process.',
  },
  // Admin log messages
  {
    value: 'New admin is created in the admin session.',
    label: 'New admin is created in the admin session.',
  },
  {
    value: 'Admin configuration is changed in the admin session.',
    label: 'Admin configuration is changed in the admin session.',
  },
  {
    value: 'Admin is deleted in the admin session.',
    label: 'Admin is deleted in the admin session.',
  },
  {
    value: 'Reset Password mail is sended by admin',
    label: 'Reset Password mail is sended by admin',
  },
  // External Source log messages
  {
    value: 'New external source is added in the admin session.',
    label: 'New external source is added in the admin session.',
  },
  {
    value: 'External source configuration is changed in the admin session.',
    label: 'External source configuration is changed in the admin session.',
  },
  {
    value: 'External source is deleted in the admin session.',
    label: 'External source is deleted in the admin session.',
  },

  // Gateway log messages
  {
    value: 'New LDAP gateway is added in the admin session.',
    label: 'New LDAP gateway is added in the admin session.',
  },
  {
    value: 'New Radius gateway is added in the admin session.',
    label: 'New Radius gateway is added in the admin session.',
  },
  {
    value: 'LDAP Gateway configuration is changed in the admin session.',
    label: 'LDAP Gateway configuration is changed in the admin session.',
  },
  {
    value: 'Radius Gateway configuration is changed in the admin session.',
    label: 'Radius Gateway configuration is changed in the admin session.',
  },
  {
    value: 'Gateway is deleted in the admin session.',
    label: 'Gateway is deleted in the admin session.',
  },

  // LDAP Profile log messages
  {
    value: 'New Attribute is added in the admin session.',
    label: 'New Attribute is added in the admin session.',
  },
  {
    value: 'Attribute configuration is changed in the admin session.',
    label: 'Attribute configuration is changed in the admin session.',
  },
  {
    value: 'Attribute is deleted in the admin session.',
    label: 'Attribute is deleted in the admin session.',
  },

  // Sms Provider log messages
  {
    value: 'New SMS Provider is added in the admin session.',
    label: 'New SMS Provider is added in the admin session.',
  },
  {
    value: 'SMS Provider configuration is changed in the admin session.',
    label: 'SMS Provider configuration is changed in the admin session.',
  },
  {
    value: 'SMS Provider is deleted in the admin session.',
    label: 'SMS Provider is deleted in the admin session.',
  },

  // Group log messages
  {
    value: 'New Group is added in the admin session.',
    label: 'New Group is added in the admin session.',
  },
  {
    value: 'Group configuration is changed in the admin session.',
    label: 'Group configuration is changed in the admin session.',
  },
  {
    value: 'Group is deleted in the admin session.',
    label: 'Group is deleted in the admin session.',
  },

  // User log messages
  {
    value: 'New user is added in the admin session.',
    label: 'New user is added in the admin session.',
  },
  {
    value: 'User configuration is changed in the admin session.',
    label: 'User configuration is changed in the admin session.',
  },
  {
    value: 'User is deleted in the admin session.',
    label: 'User is deleted in the admin session.',
  },

  // Rule log messages
  {
    value: 'New Radius Rule is added in the admin session.',
    label: 'New Radius Rule is added in the admin session.',
  },
  {
    value: 'Rule configuration is changed in the admin session.',
    label: 'Rule configuration is changed in the admin session.',
  },
  {
    value: 'Rule is deleted in the admin session.',
    label: 'Rule is deleted in the admin session.',
  },
  {
    value: 'Rule order is changed in the admin session.',
    label: 'Rule order is changed in the admin session.',
  },
];
