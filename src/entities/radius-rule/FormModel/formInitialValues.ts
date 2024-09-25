import { RadiusRuleAction } from 'app/shared/model/RadiusRulesModel';
import { formField } from './checkoutFormModel';

const {
  name,
  description,
  attributeNumber,
  authorizationAttributeType,
  authorizationValue,
  isAccept,
  isAllParticipantsIncluded,
  otpTimeout,
  participantGroups,
  participants,
  // prefix,
  // seperator,
  providerId,
  radiusClientIds,
  scheduleDays,
  scheduleEndDateTime,
  scheduleEndTime,
  scheduleStartDateTime,
  scheduleStartTime,
  scheduleType,
  sourceAddresses,
  sourceCountries,
  vendorCode,
  userOrGroup,
} = formField;

export const formInitialValues = {
  // source tab
  [name.name]: null,
  [description.name]: null,
  [radiusClientIds.name]: ['all'],
  [sourceAddresses.name]: ['0.0.0.0/0'],
  [sourceCountries.name]: ['all'],

  //
  [userOrGroup.name]: 'user',

  // users & groups tab
  [participantGroups.name]: [],
  [participants.name]: ['a'],
  [isAllParticipantsIncluded.name]: true,

  // schedule tab
  [scheduleType.name]: 0,
  [scheduleEndDateTime.name]: null,
  [scheduleStartDateTime.name]: null,
  [scheduleEndTime.name]: null,
  [scheduleStartTime.name]: null,
  [scheduleDays.name]: null,

  // action tab
  [isAccept.name]: RadiusRuleAction.Accept,
  [providerId.name]: null,
  [otpTimeout.name]: 0,
  [authorizationAttributeType.name]: 0,
  [authorizationValue.name]: null,
  [vendorCode.name]: null,
  [attributeNumber.name]: null,
  // [prefix.name]: null,
  // [seperator.name]: null,
};
