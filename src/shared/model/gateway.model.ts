import { IAttributeProfile } from "./AttributeProfile.model";
import { ITenant } from "./tenant.model";

export interface IGateway {
  id?: number;
  uid?: string;
  accountId?: string;
  name?: string | null;
  description?: string | null;
  version?: string | null;
  gatewayType?: number | null;
  gatewayIp?: string;
  gatewayStatus?: number | null;
  ldapType?: number | null;
  samName?: string | null;
  domainName?: string | null;
  isLdapSecure?: boolean | null;
  ldapIp?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
  createdOn?: string | null;
  createdDate?: string | null;
  updatedOn?: string | null;
  updatedDate?: string | null;
  tenant?: ITenant | null;
  ldapProfile?: IAttributeProfile | null;
}
export interface IRadiusClientDetailModel {
  uid: string;
  name: string;
  ipAddress: string;
  secretKey: string;
  gateway: IGateway;
  isActive: boolean;
}
export interface IRadiusClientCreateModel {
  accountId: string;
  gatewayId: string;
  name: string;
  description?: string;
  ipAddress: string;
  secretKey: string;
}
export interface IRadiusClientUpdateModel {
  accountId?: string;
  gatewayId?: string;
  uid?: string;
  name: string;
  description?: string;
  ipAddress: string;
  secretKey: string;
}
export interface IGatewayRadiusAddRequestModel {
  accountId: string;
  name: string;
  description: string;
  accountingPort: string;
  authenticationPort: string;
  radiusClients: [
    {
      name: string;
      description: string;
      ipAddress: string;
      secretKey: string;
    }
  ];
}
export interface IGatewayLDAPAddRequestModel {
  accountId: string;
  name: string;
  description: string;
  ldapType: LdapTypeInt;
  samName: string;
  isLdapSecure: boolean;
}

export interface IGatewayRadiusDetailModel {
  uid: string;
  name: string;
  description: string;
  samName: string;
  gatewayIp: string;
  version: string | null;
  gatewayStatus: GatewayStatusInt;

  accountingPort: number;
  authenticationPort: number;
}
export interface IGatewayLDAPDetailModel {
  uid: string;
  name: string;
  description: string;
  version: string;
  gatewayType: GatewayTypeInt;
  gatewayStatus: GatewayStatusInt;
  ldapType: LdapTypeInt;
  samName: string;
  isLdapSecure: true;
}

export enum RadiusGatewayDownloadOption {
  FOR_WINDOWS = 1,
  FOR_LINUX = 2,
  CONFIG = 3,
  JAVA_JDK = 4,
}
export enum LDAPGatewayDownloadOption {
  FULL = 1,
  CONFIG = 2,
}

export const defaultValue: Readonly<IGateway> = {
  isLdapSecure: false,
  isActive: false,
  isDeleted: false,
};

export enum GatewayTypeInt {
  LDAP,
  RADIUS,
}

export enum GatewayStatusInt {
  Active,
  Passive,
  Offline,
}
export enum GatewayStatus {
  Active = "Active",
  Passive = "Passive",
  Offline = "Offline",
}

export enum LdapType {
  ActiveDirectory = "Active Directory",
  Others = "Others",
}

export enum LdapTypeInt {
  ActiveDirectory,
  Others,
}
