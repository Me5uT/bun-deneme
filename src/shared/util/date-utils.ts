import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { APP_DATE_FORMAT, APP_LOCAL_DATETIME_FORMAT, APP_TIMESTAMP_FORMAT } from 'app/config/constants';
import { RuleScheduleType } from '../model/RadiusRulesModel';

dayjs.extend(advancedFormat);

export const convertDateTimeFromServer = date => (date ? dayjs(date).format(APP_TIMESTAMP_FORMAT) : null);

export const convertDateTimeToServer = date => (date ? dayjs(date).toDate() : null);

export const displayDefaultDateTime = () => dayjs().startOf('day').format(APP_LOCAL_DATETIME_FORMAT);

// format date to string
export const formatDate = (date: Date | string | number | dayjs.Dayjs, format?: string): string => {
  return dayjs(date).format(format || 'DD MMM YYYY HH:mm:ss') || '';
};

export const dayOptions = [
  {
    label: 'Monday',
    value: '0',
  },
  {
    label: 'Tuesday',
    value: '1',
  },
  {
    label: 'Wednesday',
    value: '2',
  },
  {
    label: 'Thursday',
    value: '3',
  },
  {
    label: 'Friday',
    value: '4',
  },
  {
    label: 'Saturday',
    value: '5',
  },
  {
    label: 'Sunday',
    value: '6',
  },
];

const getDayLabels = (valuesString: string) => {
  const values = valuesString.split(',');
  const labels = dayOptions.filter(option => values.includes(option.value)).map(option => option.label);

  const formatDays = (daysArray: string[]) => {
    if (daysArray.length === 0) return '';
    if (daysArray.length === 1) return daysArray[0];
    const lastDay = daysArray.pop();

    return `${daysArray.join(', ')} and ${lastDay}`;
  };

  return formatDays(labels);
};

export const getScheduleLabel = (
  scheduleType: RuleScheduleType,
  scheduleDays: string,
  scheduleStartTime: string,
  scheduleEndTime: string,
  scheduleStartDateTime: string,
  scheduleEndDateTime: string
) => {
  switch (scheduleType) {
    case RuleScheduleType.ALL:
      return `All Time`;
    case RuleScheduleType.RECURRING:
      return `${getDayLabels(scheduleDays)} ${scheduleStartTime || ''}-${scheduleEndTime || ''}`;
    case RuleScheduleType.ONETIME:
      return `${formatDate(scheduleStartDateTime, APP_DATE_FORMAT)} - ${formatDate(scheduleEndDateTime, APP_DATE_FORMAT)}`;
    default:
      return `All Time`;
  }
};
