/* eslint-disable complexity */
import { showToast } from '../hooks/showToast';
import { ITimeZone, timeZones } from '../mockdata/TimeZones';
import { EGroupType } from '../model/GroupModel';
import { LogLevel, RadiusStatus } from '../model/LoggingModel';
import { ManageCategory } from '../model/ManageModel';
import { MFAMethods } from '../model/SSPModels';
import { ESyncPeriod, ESyncStatus } from '../model/externalSourceModel';
import { GatewayStatusInt, GatewayTypeInt, LdapTypeInt } from '../model/gateway.model';
import { ParticipantStatusInt, ParticipantTypeInt } from '../model/participant.model';
import { IRequestTenantSettings, ITenantSetting } from '../model/tenant-setting.model';
import { LicenceStatusInt, LicenceTypeInt, StatusInt, TenantStatusInt, TenantTypeInt, VerificationStatusInt } from '../model/tenant.model';
import { AdminProfileInt, AdminTypeInt } from './../model/AdminModel';
import React from 'react';
export const findObjectChanges = (initialArray: any[], newArray: any[]) => {
  if (!initialArray) initialArray = [];
  if (!newArray) newArray = [];

  const addedElements = newArray.filter(newObj => !initialArray.some(initObj => initObj.uid === newObj.uid));
  const removedElements = initialArray.filter(initObj => !newArray.some(newObj => newObj.uid === initObj.uid));

  return {
    added: addedElements,
    removed: removedElements,
  };
};

export const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied !', {
      position: 'top-center',
      autoClose: 2000,
      style: {
        width: 130,
      },
    });
  } catch (err) {
    console.log('Can not copy!', err);
  }
};

export const serializeEnableMfaList = (obje: { enabledMfaList: number[]; defaultMfa: number }) => {
  return {
    isPushEnable: obje.enabledMfaList.includes(MFAMethods.MirketPushNotification),
    isPushDefault: obje.defaultMfa === MFAMethods.MirketPushNotification,

    isTokenEnable: obje.enabledMfaList.includes(MFAMethods.MirketToken),
    isTokenDefault: obje.defaultMfa === MFAMethods.MirketToken,

    isOtpEnable: obje.enabledMfaList.includes(MFAMethods.MirketOTPCode),
    isOtpDefault: obje.defaultMfa === MFAMethods.MirketOTPCode,

    isTotpEnable: obje.enabledMfaList.includes(MFAMethods.TOTPCOde),
    isTotpDefault: obje.defaultMfa === MFAMethods.TOTPCOde,

    isSmsEnable: obje.enabledMfaList.includes(MFAMethods.SMS),
    isSmsDefault: obje.defaultMfa === MFAMethods.SMS,
  };
};

export const deserializeEnableMfaList = (serializedObject: {
  isPushEnable: boolean;
  isPushDefault: boolean;
  isTokenEnable: boolean;
  isTokenDefault: boolean;
  isOtpEnable: boolean;
  isOtpDefault: boolean;
  isTotpEnable: boolean;
  isTotpDefault: boolean;
  isSmsEnable: boolean;
  isSmsDefault: boolean;
}) => {
  const enabledMfaList: number[] = [];

  if (serializedObject.isPushEnable) enabledMfaList.push(MFAMethods.MirketPushNotification);
  if (serializedObject.isTokenEnable) enabledMfaList.push(MFAMethods.MirketToken);
  if (serializedObject.isOtpEnable) enabledMfaList.push(MFAMethods.MirketOTPCode);
  if (serializedObject.isTotpEnable) enabledMfaList.push(MFAMethods.TOTPCOde);
  if (serializedObject.isSmsEnable) enabledMfaList.push(MFAMethods.SMS);

  let defaultMfa = 0;
  if (serializedObject.isPushDefault) defaultMfa = MFAMethods.MirketPushNotification;
  if (serializedObject.isTokenDefault) defaultMfa = MFAMethods.MirketToken;
  if (serializedObject.isOtpDefault) defaultMfa = MFAMethods.MirketOTPCode;
  if (serializedObject.isTotpDefault) defaultMfa = MFAMethods.TOTPCOde;
  if (serializedObject.isSmsDefault) defaultMfa = MFAMethods.SMS;

  return { enabledMfaList, defaultMfa };
};

export const formatSourceLabel = (arr: string[]) => {
  if (Array.isArray(arr) && arr.length < 3) {
    return arr.join(' & ');
  }
  if (Array.isArray(arr) && arr.length >= 3) {
    return arr.slice(0, 2).join(', ') + ' ...';
  }
  return '';
};

export const removeItemsByUid = (arr1: any[], arr2: any[]): any[] => {
  const uidsToRemove = new Set(arr2.map(item => item.uid));

  return arr1.filter(item => !uidsToRemove.has(item.uid));
};

export const uniqueByUid = (arr: any[]): any[] => {
  const uidMap = new Map<string, any>();

  arr.forEach(item => {
    if (!uidMap.has(item.uid)) {
      uidMap.set(item.uid, item);
    }
  });

  return Array.from(uidMap.values());
};

export const splitDefaultSmsProviders = (providerList: any[]) => {
  return providerList.filter(p => p.provider > 14 || p.provider === null) || [];
};

// export const showOTPTimeout = (uid?: string | null) => {
//   switch (uid) {
//     case 'addb7fd9-8c27-4fa6-94a9-ade96b396473':
//     case 'fa86683a-f161-4c2e-88ec-3dfc2253e0ba':
//     case 'bdb32e7c-e54d-445e-b3e8-3d4e312d2286':
//     case '0ae6dc95-9a8f-4d0e-83b0-eec1488806f5':
//     case '479e9a38-ae05-4f74-a26f-aa106625b38b':
//     case null:
//     case undefined:
//       return false;

//     default:
//       return true;
//   }
// };
export const showOTPTimeout = (providerUid?: string, smsProviderList?: any[]) => {
  const provider = smsProviderList?.find(p => p.uid === providerUid);
  return provider?.provider > 14 ? true : false;
};
export const isUserDeviceMobile = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipad|ipod|android/i.test(userAgent);
  return isMobile;
};

export const createSerializedObject = (obj: any): any => {
  const newObj = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

export const randomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export const randomNumbers = () => {
  const numbers = [];
  while (numbers.length < 5) {
    const randomNumber = Math.floor(Math.random() * 50) + 1; // 1 ile 50 arası rasgele sayı üret
    if (!numbers.includes(randomNumber)) {
      // Sayı daha önce eklenmemişse
      numbers.push(randomNumber); // Sayıyı diziye ekle
    }
  }
  return numbers;
};

export const getTimeZoneLabel = (v: string): string => {
  return timeZones.find((tz: ITimeZone) => tz.value === v)?.label || '';
};
export const convertArrayToObject = (array: any[]) => {
  const result: any = {};

  // string gelen tiplerin düzenlenmesi
  array.forEach(item => {
    switch (true) {
      case item.value === 'true':
        result[item.key] = true;
        break;

      case item.value === 'false':
        result[item.key] = false;
        break;

      case item.value === null:
      case item.value === undefined:
      case item.value === '':
        result[item.key] = null;
        break;

      case !Number.isNaN(Number(item.value)) && item.key !== 'ipAddress' && item.key !== 'passwordPolicyRegex':
        result[item.key] = Number(item.value);
        break;

      default:
        result[item.key] = item.value;
        break;
    }
  });

  return result;
};

export const convertObjectToSettingsArray = (obj: IRequestTenantSettings, arr: ITenantSetting[]) => {
  const result = arr
    .map(i => ({
      value: obj[i.key],
      uid: i.uid,
    }))
    .filter(i => (i.value && (i.value !== null || i.value !== undefined)) || Number(i.value) >= 0);

  return result;
};

export const convertClassPathsToOptions = (classPaths: { key: string; value: string }[]) => {
  return classPaths?.map(item => ({ label: item.key, value: item.value }));
};

export const acceptJustNumericCharacter = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    event.key === 'Backspace' ||
    event.key === 'Delete' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === 'Tab'
  ) {
    return;
  }

  if (!/[0-9]/.test(event.key)) {
    event.preventDefault();
  }
};

const BooleanColors = {
  ['true']: 'green',
  ['false']: 'red',
};

const StatusIntColors = {
  [StatusInt.Active]: 'green',
  [StatusInt.Passive]: 'red',
  [StatusInt.Pending]: 'orange',
};

const ParticipantTypeColors = {
  [ParticipantTypeInt.Local]: '#58587d',
  [ParticipantTypeInt.LDAP]: 'default',
};

const ParicipantStatusColors = {
  [ParticipantStatusInt.Active]: '#0dbd0d',
  [ParticipantStatusInt.Syncing]: '#636fdc',
  [ParticipantStatusInt.Passive]: 'gray',
  [ParticipantStatusInt.Lock]: 'red',
};
const RadiusStatusColors = {
  [RadiusStatus.SUCCESS]: 'green',
  [RadiusStatus.FAILURE]: 'orangered',
  [RadiusStatus.WAITING]: 'yellow',
  [RadiusStatus.NONE]: 'default',
  [RadiusStatus.DENIED]: 'default',
};
const TenantStatusColors = {
  [TenantStatusInt.Active]: 'green',
  [TenantStatusInt.Passive]: 'red',
  [TenantStatusInt.Pending]: 'orange',
};

const TenantTypeColors = {
  [TenantTypeInt.ENDUSER]: 'burlywood',
  [TenantTypeInt.MSSP]: 'coral',
  [TenantTypeInt.MIRKET]: 'cadetblue',
};

const LicenceTypeColors = {
  [LicenceTypeInt.Demo]: 'grey',
  [LicenceTypeInt.MFA]: '#11a6d7',
  [LicenceTypeInt.SSO]: 'darkblue',
};

const LicenceStatusColors = {
  [LicenceStatusInt.Active]: 'green',
  [LicenceStatusInt.Expired]: 'red',
  [LicenceStatusInt.Soon]: 'yellow',
  [LicenceStatusInt.Deleted]: 'black',
};

const VerificationStatusColors = {
  [VerificationStatusInt.Verified]: 'green',
  [VerificationStatusInt.Pending]: 'orange',
  [VerificationStatusInt.Failed]: 'red',
  [VerificationStatusInt.Manuel]: '#11a6d7',
};

const AdminTypeColors = {
  [AdminTypeInt.OWNER]: 'green',
  [AdminTypeInt.MASTER_ADMIN]: 'orange',
  [AdminTypeInt.ACCOUNT_ADMIN]: 'blue',
};

const AdminProfileColors = {
  [AdminProfileInt.FullControl]: 'green',
  [AdminProfileInt.ReadOnly]: '#ff5e00',
};

const GroupTypeColors = {
  [EGroupType.LOCAL]: '#ed880b',
  [EGroupType.LDAP]: '#42d3ad',
};

const GatewayTypeColors = {
  [GatewayTypeInt.LDAP]: '#8978de',
  [GatewayTypeInt.RADIUS]: '#87de78',
};

const GatewayStatusColors = {
  [GatewayStatusInt.Active]: 'green',
  [GatewayStatusInt.Passive]: 'gray',
  [GatewayStatusInt.Offline]: 'red',
};

const LDAPTypeColors = {
  [LdapTypeInt.ActiveDirectory]: '#8978de',
  [LdapTypeInt.Others]: '#87de78',
};

const SyncPeriodColors = {
  [ESyncPeriod.ONDEMAND]: '#6f295f',
  [ESyncPeriod.ONEHOURS]: '#d237ae',
  [ESyncPeriod.SIXHOURS]: '#8704af',
  [ESyncPeriod.TWENTYFOURHOURS]: '#045baf',
};

const SyncStatusColors = {
  [ESyncStatus.SUCCESS]: '#04af84',
  [ESyncStatus.FAILED]: '#d23737',
  [ESyncStatus.AUTO_SYNC_NOT_STARTED]: '#8704af',
  [ESyncStatus.AUTO_SYNC_STARTED]: '#6f295f',
  [ESyncStatus.SYNCING]: '#87de78',
};

const LogLevelColors = {
  [LogLevel.CONFIG]: 'blue',
  [LogLevel.INFO]: 'green',
  [LogLevel.WARNING]: 'red',
};

const CategoryColors = {
  [ManageCategory.Credential_Harvesting]: '#7b6df2',
  [ManageCategory.Account_Takeover]: '#5b7a98',
  [ManageCategory.Credential_Stuffing]: '#618ccc',
};

// Genel renk alma fonksiyonu
export const getColorByType = (enumType: any, value: number | boolean): string => {
  switch (enumType) {
    case TenantStatusInt:
      return TenantStatusColors[value as number] || 'gray';
    case LicenceTypeInt:
      return LicenceTypeColors[value as number] || 'gray';
    case LicenceStatusInt:
      return LicenceStatusColors[value as number] || 'gray';
    case VerificationStatusInt:
      return VerificationStatusColors[value as number] || 'gray';
    case TenantTypeInt:
      return TenantTypeColors[value as number] || 'gray';
    case AdminTypeInt:
      return AdminTypeColors[value as number] || 'gray';
    case AdminProfileInt:
      return AdminProfileColors[value as number] || 'gray';
    case ParticipantStatusInt:
      return ParicipantStatusColors[value as number] || 'gray';
    case RadiusStatus:
      return RadiusStatusColors[value as number] || 'gray';
    case ParticipantTypeInt:
      return ParticipantTypeColors[value as number] || 'gray';
    case StatusInt:
      return StatusIntColors[value as number] || 'gray';
    case LogLevel:
      return LogLevelColors[value as number] || 'blue';
    case EGroupType:
      return GroupTypeColors[value as number] || 'gray';
    case GatewayTypeInt:
      return GatewayTypeColors[value as number] || 'gray';
    case GatewayStatusInt:
      return GatewayStatusColors[value as number] || 'gray';
    case LdapTypeInt:
      return LDAPTypeColors[value as number] || 'gray';
    case ESyncPeriod:
      return SyncPeriodColors[value as number] || 'gray';
    case ESyncStatus:
      return SyncStatusColors[value as number] || 'gray';
    case ManageCategory:
      return CategoryColors[value as number] || 'gray';
    case Boolean:
      return (value as boolean) ? 'green' : 'red';

    default:
      return 'gray'; // Belirtilmemiş veya tanımlanmamış enum için varsayılan renk
  }
};

export const getRateColorForSuccess = (i: number) => {
  switch (true) {
    case i === 0:
      return '#27ae60';
    case i === 1:
      return '#27ae60';
    case i === 2:
      return '#27ae60';
    case i === 3:
      return '#3498db';
    case i === 4:
      return '#2980b9';
    case i === 5:
      return '#1f618d';
    default:
      return 'lightgray';
  }
};
export const getRateColorForFail = (i: number) => {
  switch (true) {
    case i === 0:
      return '#fa2020';
    case i === 1:
      return '#fa2020';
    case i === 2:
      return '#fa2020';
    case i === 3:
      return '#fa5b20';
    case i === 4:
      return '#faae20';
    case i === 5:
      return '#faae20';
    default:
      return 'lightgray';
  }
};
export const openNewTab = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
