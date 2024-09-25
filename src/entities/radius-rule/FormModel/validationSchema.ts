import * as Yup from 'yup';
import { formField } from './checkoutFormModel';
import { RadiusRuleAction, RuleScheduleType } from 'app/shared/model/RadiusRulesModel';
import { UserOrGroup } from '../tabs/RadiusRulesUserAndGroups';

const {
  name,
  description,
  attributeNumber,
  authorizationAttributeType,
  authorizationValue,
  isAccept,
  otpTimeout,
  participantGroups,
  participants,
  providerId,
  radiusClientIds,
  scheduleDays,
  scheduleEndDateTime,
  scheduleEndTime,
  scheduleStartDateTime,
  scheduleStartTime,
  scheduleType,
  // prefix,
  // seperator,
  sourceAddresses,
  sourceCountries,
  vendorCode,
  userOrGroup,
} = formField;

export const withGroupValidation = [
  // source tab
  Yup.object().shape({
    [name.name]: Yup.string().required('Name is required.'),
    [description.name]: Yup.string().nullable(),
    [radiusClientIds.name]: Yup.array().min(1),
    [sourceAddresses.name]: Yup.array().min(1),
    [sourceCountries.name]: Yup.array().min(1),
  }),

  // users or groups tab
  Yup.object().shape({
    [userOrGroup.name]: Yup.mixed().oneOf(Object.values(UserOrGroup)),
  }),

  // users & groups tab
  Yup.object().shape({
    [participants.name]: Yup.array().nullable(),
    [participantGroups.name]: Yup.array().min(1),
  }),
  // schedule tab
  Yup.object().shape({
    [scheduleType.name]: Yup.mixed().oneOf(Object.values(RuleScheduleType)),
    [scheduleStartDateTime.name]: Yup.string().nullable(),
    [scheduleEndDateTime.name]: Yup.string().nullable(),
    [scheduleStartTime.name]: Yup.string().nullable(),
    [scheduleEndTime.name]: Yup.string().nullable(),

    ['scheduleRange']: Yup.mixed().when([scheduleType.name], ([scheduleTypes], schema) => {
      return scheduleTypes !== RuleScheduleType.ALL ? schema.required() : schema.nullable();
    }),
    [scheduleDays.name]: Yup.string().when([scheduleType.name], ([scheduleTypes], schema) => {
      return scheduleTypes === RuleScheduleType.RECURRING ? schema.required() : schema.nullable();
    }),
  }),
  // action tab
  Yup.object().shape({
    [isAccept.name]: Yup.mixed().oneOf(Object.values(RadiusRuleAction)),
    [providerId.name]: Yup.string().when([isAccept.name], ([selectedAction], schema) => {
      return selectedAction === RadiusRuleAction.Accept ? schema.required() : schema.nullable();
    }),
    [otpTimeout.name]: Yup.number(),
    [authorizationAttributeType.name]: Yup.number(),
    [authorizationValue.name]: Yup.string().when([authorizationAttributeType.name], ([selectedAction], schema) => {
      return selectedAction !== 0 ? schema.required() : schema.nullable();
    }),
    [vendorCode.name]: Yup.number().when([authorizationAttributeType.name], ([selectedAction], schema) => {
      return selectedAction === 26 ? schema.required() : schema.nullable();
    }),
    [attributeNumber.name]: Yup.number().when([authorizationAttributeType.name], ([selectedAction], schema) => {
      return selectedAction === 26 ? schema.required() : schema.nullable();
    }),
    // [prefix.name]: Yup.string().nullable(),
    // [seperator.name]: Yup.string().nullable(),
  }),
];
export const withUserValidation = [
  // source tab
  Yup.object().shape({
    [name.name]: Yup.string().required('Name is required.'),
    [description.name]: Yup.string().nullable(),
    [radiusClientIds.name]: Yup.array().min(1),
    [sourceAddresses.name]: Yup.array().min(1),
    [sourceCountries.name]: Yup.array().min(1),
  }),

  // users or groups tab
  Yup.object().shape({
    [userOrGroup.name]: Yup.mixed().oneOf(Object.values(UserOrGroup)),
  }),

  // users & groups tab
  Yup.object().shape({
    [participants.name]: Yup.array().min(1),
    [participantGroups.name]: Yup.array().nullable(),
  }),
  // schedule tab
  Yup.object().shape({
    [scheduleType.name]: Yup.mixed().oneOf(Object.values(RuleScheduleType)),
    [scheduleStartDateTime.name]: Yup.string().nullable(),
    [scheduleEndDateTime.name]: Yup.string().nullable(),
    [scheduleStartTime.name]: Yup.string().nullable(),
    [scheduleEndTime.name]: Yup.string().nullable(),

    ['scheduleRange']: Yup.mixed().when([scheduleType.name], ([scheduleTypes], schema) => {
      return scheduleTypes !== RuleScheduleType.ALL ? schema.required() : schema.nullable();
    }),
    [scheduleDays.name]: Yup.string().when([scheduleType.name], ([scheduleTypes], schema) => {
      return scheduleTypes === RuleScheduleType.RECURRING ? schema.required() : schema.nullable();
    }),
  }),
  // action tab
  Yup.object().shape({
    [isAccept.name]: Yup.mixed().oneOf(Object.values(RadiusRuleAction)),
    // [providerId.name]: Yup.string().nullable(),
    [providerId.name]: Yup.string().when([isAccept.name], ([selectedAction], schema) => {
      return selectedAction === RadiusRuleAction.Accept ? schema.required() : schema.nullable();
    }),

    [otpTimeout.name]: Yup.number(),
    [authorizationAttributeType.name]: Yup.number(),
    [authorizationValue.name]: Yup.string().when([authorizationAttributeType.name], ([selectedAction], schema) => {
      return selectedAction !== 0 ? schema.required() : schema.nullable();
    }),

    [vendorCode.name]: Yup.number().when([authorizationAttributeType.name], ([selectedAction], schema) => {
      return selectedAction === 26 ? schema.required() : schema.nullable();
    }),
    [attributeNumber.name]: Yup.number().when([authorizationAttributeType.name], ([selectedAction], schema) => {
      return selectedAction === 26 ? schema.required() : schema.nullable();
    }),
    // [prefix.name]: Yup.string().nullable(),
    // [seperator.name]: Yup.string().nullable(),
  }),
];
