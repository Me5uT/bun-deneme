import { Input } from 'antd';
import React from 'react';
import InputMask from 'react-input-mask';

export const InputIPAddressV4Sub = props => {
  const checkIpValue = React.useCallback((value: any) => {
    // separate the octets per "."
    const subips = value.split('.');
    const subBars = value.split('/');

    // validate the number of octets
    if (subips.length > 4) {
      return false;
    }

    if (subips.length === 4 && subBars.length === 2) {
      return true;
    }

    // validate sub ips -> each sub ip can't have more than 3 chars
    // an the number can't be greater than 255
    const invalidSubips = subips.filter((ip, index) => {
      if (ip.length > 3) {
        return true;
      }
      ip = Number(ip);
      return ip < 0 || ip > 255;
    });

    if (invalidSubips.length !== 0) {
      return false;
    }

    let emptyIpCount = 0;
    subips.forEach(ip => {
      if (ip === '') {
        emptyIpCount++;
      }
    });
    if (emptyIpCount > 1) {
      return false;
    }
    return true;
  }, []);

  const beforeMaskedValueChange = React.useCallback((newState, oldState, userInput) => {
    let value = newState.value;
    const oldValue = oldState.value;
    let selection = newState.selection;
    let cursorPosition = selection ? selection.start : null;
    const result = checkIpValue(value);
    const countBars = value.split('/').length - 1;
    const subips = value.split('.');
    const lastSubIp = subips[3];
    const lastSubIpInt = Number(lastSubIp);

    if (value.includes('/')) {
      if (subips.length !== 4 || countBars !== 1 || value.split('/')[1].length > 2 || lastSubIp === '/') {
        value = oldValue;
        return {
          value,
          selection,
        };
      }
    }

    if ((!value.includes('/') && lastSubIp && lastSubIp.length > 3) || lastSubIpInt < 0 || lastSubIpInt > 255) {
      value = value.trim();
      const newValueWithBar = value.substring(0, value.length - 1) + '/' + value.substring(value.length - 1);

      if (subips.length !== 4 || countBars !== 1 || newValueWithBar.split('/')[1].length > 2 || lastSubIp === '/') {
        cursorPosition++;
        selection = { start: cursorPosition, end: cursorPosition };
        value = newValueWithBar;
      } else {
        value = oldValue;
      }

      return {
        value,
        selection,
      };
    }

    if (!result) {
      value = value.trim();
      // try to add . before the last char to see if it is valid ip address
      const newValue = value.substring(0, value.length - 1) + '.' + value.substring(value.length - 1);

      if (checkIpValue(newValue)) {
        cursorPosition++;
        selection = { start: cursorPosition, end: cursorPosition };
        value = newValue;
      } else {
        value = oldValue;
      }
    }

    return {
      value,
      selection,
    };
  }, []);

  return (
    <InputMask
      formatChars={{
        '9': '[0-9./]',
      }}
      mask="999999999999999999"
      maskChar={null}
      alwaysShowMask={false}
      beforeMaskedValueChange={beforeMaskedValueChange}
      {...props}
    >
      {inputProps => <Input {...inputProps} />}
    </InputMask>
  );
};
