import { IManageListModel, SubCondition } from 'app/shared/model/ManageModel';
import { ManageCategory } from '../model/ManageModel';

export const categoryList = [
  {
    label: 'Credential Harvesting',
    value: 0,
  },
  {
    label: 'Credential Stuffing',
    value: 1,
  },
  {
    label: 'Account Takeover',
    value: 2,
  },
];

export const mockManageList: IManageListModel[] = [
  {
    uid: 'e85129f2-d2bc-4c6a-af53-8a7ed52b478c',
    detectionNumber: 'Detection Mentis-D-1',
    category: ManageCategory.Credential_Stuffing,
    detection: 'Malicious IP - Credential Checking',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 90,
    threatScore: 30,
    status: true,
    testInput: [],
    subCondition: SubCondition.UNKNOWN_USER,
    phases: 1,
  },
  {
    uid: '0a20439f-c295-4d40-a49f-4a7948e7526d',
    detectionNumber: 'Detection Mentis-D-2',
    category: ManageCategory.Credential_Stuffing,
    detection: 'Malicious IP - Access Attempt',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 90,
    threatScore: 40,
    status: true,
    testInput: [],
    subCondition: SubCondition.FIRST_FACTOR_FAILED,
    phases: 1,
  },
  {
    uid: '93d72c79-25c7-47e2-8704-b851059beb41',
    detectionNumber: 'Detection Mentis-D-3',
    category: ManageCategory.Account_Takeover,
    detection: 'Malicious IP - Identity Breach Suspected',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 90,
    threatScore: 80,
    status: true,
    testInput: [],
    subCondition: SubCondition.SECOND_FACTOR_FAILED,
    phases: 1,
  },
  {
    uid: '1f6b54e5-197f-487b-9ef5-920518e56330',
    detectionNumber: 'Detection Mentis-D-4',
    category: ManageCategory.Account_Takeover,
    detection: 'Malicious IP -  Authentication',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 90,
    threatScore: 90,
    status: true,
    testInput: [],
    subCondition: SubCondition.AUTHENTICATION_SUCCESSFULL,
    phases: 1,
  },
  {
    uid: 'f94add2f-fafc-421c-a7f2-c360ccabce6c',
    detectionNumber: 'Detection Mentis-D-5',
    category: ManageCategory.Credential_Stuffing,
    detection: 'Suspicious IP - Credential Checking',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 40,
    threatScore: 20,
    status: true,
    testInput: [],
    subCondition: SubCondition.UNKNOWN_USER,
    phases: 1,
  },
  {
    uid: 'd078c531-4082-49b4-8764-949b11a562c1',
    detectionNumber: 'Detection Mentis-D-6',
    category: ManageCategory.Credential_Stuffing,
    detection: 'Suspicious IP - Access Attempt',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 40,
    threatScore: 30,
    status: true,
    testInput: [],
    subCondition: SubCondition.FIRST_FACTOR_FAILED,
    phases: 1,
  },
  {
    uid: 'd3af35c8-d083-475a-abdd-5d456b05e9af',
    detectionNumber: 'Detection Mentis-D-7',
    category: ManageCategory.Account_Takeover,
    detection: 'Suspicious IP - Identity Breach Suspected',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 40,
    threatScore: 50,
    status: true,
    testInput: [],
    subCondition: SubCondition.SECOND_FACTOR_FAILED,
    phases: 1,
  },
  {
    uid: '7855b861-5c64-445b-add6-0996d02049e7',
    detectionNumber: 'Detection Mentis-D-8',
    category: ManageCategory.Account_Takeover,
    detection: 'Suspicious IP - Authentication',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 40,
    threatScore: 55,
    status: true,
    testInput: [],
    subCondition: SubCondition.AUTHENTICATION_SUCCESSFULL,
    phases: 1,
  },
  {
    uid: 'b209d650-2d5a-49e3-865e-9a44357632fc',
    detectionNumber: 'Detection Mentis-D-9',
    category: ManageCategory.Credential_Stuffing,
    detection: 'Tor Activity - Credential Checking',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 50,
    threatScore: 25,
    status: true,
    testInput: [],
    subCondition: SubCondition.UNKNOWN_USER,
    phases: 1,
  },
  {
    uid: 'bf54e4ef-cc7f-443b-9cff-bcbe2b7c77d0',
    detectionNumber: 'Detection Mentis-D-10',
    category: ManageCategory.Credential_Stuffing,
    detection: 'Tor Activity  - Access Attempt',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 50,
    threatScore: 40,
    status: true,
    testInput: [],
    subCondition: SubCondition.FIRST_FACTOR_FAILED,
    phases: 1,
  },
  {
    uid: '7ac48511-919a-4259-8340-87e0be95c868',
    detectionNumber: 'Detection Mentis-D-11',
    category: ManageCategory.Account_Takeover,
    detection: 'Tor Activity  - Identity Breach Suspected',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 50,
    threatScore: 50,
    status: true,
    testInput: [],
    subCondition: SubCondition.SECOND_FACTOR_FAILED,
    phases: 1,
  },
  {
    uid: 'd315e9e3-cf08-46c6-b5aa-9cee3857bb55',
    detectionNumber: 'Detection Mentis-D-12',
    category: ManageCategory.Account_Takeover,
    detection: 'Tor Activity  - Authentication',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 50,
    threatScore: 55,
    status: true,
    testInput: [],
    subCondition: SubCondition.AUTHENTICATION_SUCCESSFULL,
    phases: 1,
  },
  {
    uid: 'ff6cb64f-54cf-45ba-a207-b7055341eded',
    detectionNumber: 'Detection Mentis-D-13',
    category: ManageCategory.Credential_Stuffing,
    detection: 'VPN/Proxy - Credential Checking',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 60,
    threatScore: 30,
    status: true,
    testInput: [],
    subCondition: SubCondition.UNKNOWN_USER,
    phases: 1,
  },
  {
    uid: 'c38ee6e9-282b-4efd-a5cf-7b9b42dcfa83',
    detectionNumber: 'Detection Mentis-D-14',
    category: ManageCategory.Credential_Stuffing,
    detection: 'VPN/Proxy - Access Attempt',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 60,
    threatScore: 40,
    status: true,
    testInput: [],
    subCondition: SubCondition.FIRST_FACTOR_FAILED,
    phases: 1,
  },
  {
    uid: '2fd6947f-3331-4779-9a28-eaf7b0e7b5a9',
    detectionNumber: 'Detection Mentis-D-15',
    category: ManageCategory.Account_Takeover,
    detection: 'VPN/Proxy  - Identity Breach Suspected',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 60,
    threatScore: 90,
    status: true,
    testInput: [],
    subCondition: SubCondition.SECOND_FACTOR_FAILED,
    phases: 1,
  },
  {
    uid: 'eee8d696-44fa-4a69-846c-6454ffddaab3',
    detectionNumber: 'Detection Mentis-D-16',
    category: ManageCategory.Account_Takeover,
    detection: 'VPN/Proxy  - Authentication',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 60,
    threatScore: 30,
    status: true,
    testInput: [],
    subCondition: SubCondition.AUTHENTICATION_SUCCESSFULL,
    phases: 1,
  },
  {
    uid: '6322a7b4-d78a-4cb8-8088-139e08dad26e',
    detectionNumber: 'Detection Mentis-D-17',
    category: ManageCategory.Credential_Stuffing,
    detection: 'Cloud Provider Origin - Credential Checking',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 90,
    threatScore: 25,
    status: true,
    testInput: [],
    subCondition: SubCondition.UNKNOWN_USER,
    phases: 1,
  },
  {
    uid: '8bed13fb-90f3-4c43-a7ce-a6521ac6a259',
    detectionNumber: 'Detection Mentis-D-18',
    category: ManageCategory.Credential_Stuffing,
    detection: 'Cloud Provider Origin - Access Attempt',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 90,
    threatScore: 40,
    status: true,
    testInput: [],
    subCondition: SubCondition.FIRST_FACTOR_FAILED,
    phases: 1,
  },
  {
    uid: '6794f193-1c4a-454a-af78-702cb2dcb57e',
    detectionNumber: 'Detection Mentis-D-19',
    category: ManageCategory.Account_Takeover,
    detection: 'Cloud Provider Origin  - Identity Breach Suspected',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 90,
    threatScore: 90,
    status: true,
    testInput: [],
    subCondition: SubCondition.SECOND_FACTOR_FAILED,
    phases: 1,
  },
  {
    uid: 'bc042bd8-4c77-41b0-8767-aab21b395b87',
    detectionNumber: 'Detection Mentis-D-20',
    category: ManageCategory.Account_Takeover,
    detection: 'Cloud Provider Origin  - Authentication',
    lastDetect: '15.07.2024',
    excludeUsers: ['all'],
    excludeIPs: ['1.2.3.4'],
    certaincyScore: 90,
    threatScore: 30,
    status: true,
    testInput: [],
    subCondition: SubCondition.AUTHENTICATION_SUCCESSFULL,
    phases: 1,
  },
];
