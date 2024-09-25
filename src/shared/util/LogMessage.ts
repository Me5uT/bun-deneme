export const stringToObject = (str: string) => {
  return JSON.parse(str)[JSON.parse(str).length - 1];
};

export const serializeLogMessage = (unSerializedMsg: string, unParsedStr: string, logType?: string, responseStatus?: number) => {
  // name yada username yada uid
  let name = '';

  if (unSerializedMsg.includes('login') && responseStatus === 500) {
    name = stringToObject(unParsedStr)?.username;
    return `Login Failed (${name})`;
  }

  if (stringToObject(unParsedStr)?.settings) {
    name = '';
  } else {
    name = stringToObject(unParsedStr)?.name || stringToObject(unParsedStr)?.username || stringToObject(unParsedStr)?.mail || '';
  }

  return name ? `${unSerializedMsg}  (${name})` : unSerializedMsg;
};

export const serializeLogObject = (logParams: string, apiName = '') => {
  let objectSTR = '';
  let parsedJSON;
  if (logParams) {
    parsedJSON = JSON.parse(logParams);
  } // .find(o => o.fieldName === 'mail');

  switch (true) {
    case apiName.includes('admin'): {
      const parsedObject = parsedJSON.find(o => o.fieldName === 'mail' || o.fieldName === 'email');
      objectSTR = parsedObject?.newValue.slice(1, -1) || parsedObject?.oldValue.slice(1, -1);
      break;
    }

    case apiName.includes('authenticate'): {
      const parsedObject = parsedJSON.find(o => o.fieldName === 'firstName');
      objectSTR = parsedObject?.newValue.slice(1, -1) || parsedObject?.oldValue.slice(1, -1);
      break;
    }

    case apiName.includes('tenant-settings'): {
      parsedJSON.forEach(pJson => {
        if (
          pJson.fieldName === 'language' ||
          pJson.fieldName === 'timeZone' ||
          pJson.fieldName === 'userVerificationTimeoutTime' ||
          pJson.fieldName === 'userTotpTimeoutTime' ||
          pJson.fieldName === 'userSetPasswordTimeoutTime' ||
          pJson.fieldName === 'adminVerificationTimeoutTime' ||
          pJson.fieldName === 'adminSetPasswordTimeoutTime' ||
          pJson.fieldName === 'passwordPolicyRegex' ||
          pJson.fieldName === 'bruteForceProtectionTime' ||
          pJson.fieldName === 'phoneCountryCode' ||
          pJson.fieldName === 'defaultOtpProvider' ||
          pJson.fieldName === 'companyName' ||
          pJson.fieldName === 'enableCsaDetectionNotification' ||
          pJson.fieldName === 'agentAndGatewayStatusNotification' ||
          pJson.fieldName === 'status' ||
          pJson.fieldName === 'ipAddress' ||
          pJson.fieldName === 'port' ||
          pJson.fieldName === 'messageFormat' ||
          pJson.fieldName === 'manuelProvision'
        ) {
          const fieldValue = pJson?.newValue ? pJson.newValue.slice(1, -1) : pJson?.oldValue.slice(1, -1);
          objectSTR += `${pJson.fieldName} : ${fieldValue} `;
        }
      });
      break;
    }

    default: {
      const parsedObject = parsedJSON ? parsedJSON.find(o => o.fieldName === 'name' || o.fieldName === 'username') : '';
      objectSTR = parsedObject ? parsedObject?.newValue.slice(1, -1) || parsedObject?.oldValue.slice(1, -1) : '';
      break;
    }
  }

  return objectSTR;
};

export const serializeLogLookUp = (data: [string, number][]) => {
  const IPs: { value: string; label: string }[] = [];
  const messages: { value: string; label: string }[] = [];
  const logTypes: { value: string; label: string }[] = [];

  data.forEach(([message, type]) => {
    switch (type) {
      case 1:
        IPs?.push({ value: message, label: message });
        break;
      case 2:
        messages?.push({ value: message, label: message });
        break;
      case 3:
        logTypes?.push({ value: message, label: message });
        break;

      default:
        break;
    }
  });

  return { IPs, messages, logTypes };
};

export const getBrowserInfo = (userAgent: string): string => {
  const userAgentLower = userAgent?.toLowerCase();
  let browserName = 'Unknown';
  let browserVersion = '';

  if (userAgentLower?.includes('opera') || userAgentLower?.includes('opr') || userAgentLower?.includes('OPR')) {
    browserName = 'Opera';
    browserVersion = userAgentLower.match(/(?:opera|opr|OPR)\/([\d.]+)/)[1];
  } else if (userAgentLower?.includes('firefox')) {
    browserName = 'Firefox';
    browserVersion = userAgentLower.match(/firefox\/([\d.]+)/)[1];
  } else if (userAgentLower?.includes('safari') && !userAgentLower.includes('chrome')) {
    browserName = 'Safari';
    browserVersion = userAgentLower.match(/version\/([\d.]+)/)[1];
  } else if (userAgentLower?.includes('chrome')) {
    browserName = 'Chrome';
    browserVersion = userAgentLower.match(/chrome\/([\d.]+)/)[1];
  } else if (userAgentLower?.includes('edge')) {
    browserName = 'Edge';
    browserVersion = userAgentLower.match(/edge\/([\d.]+)/)[1];
  } else if (userAgentLower?.includes('msie') || userAgentLower?.includes('trident')) {
    browserName = 'Internet Explorer';
    browserVersion = userAgentLower.match(/(msie |rv:)([\d.]+)/)[2];
  }

  return `${browserName}/${browserVersion}`;
};
