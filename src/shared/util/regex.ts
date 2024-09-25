// ip inputları için regex tanımı.
// 0.0.0.0 - 255.255.255.255 arasında bir ip adresi olmalı.
export const ipRegex =
  /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;

// ip inputları için regex tanımı.
// 0.0.0.0 - 255.255.255.255 arasında bir ip adresi olmalı.
// 0.0.0.0/0 - 255.255.255.255/65535 arasında bir ip adresi olmalı.
export const ipWithPortRegex =
  /^\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b(?:\/(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[0-9]{1,4}))?$/;

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const enabledChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'Tab', 'Delete', 'Enter'];
export const enabledCharsWithSlash = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '/', 'Backspace', 'Tab', 'Delete', 'Enter'];

export const validateIP = (rule: any, value: string) => {
  if (value && !ipRegex.test(value)) {
    return Promise.reject('Invalid IP address!');
  }
  return Promise.resolve();
};
