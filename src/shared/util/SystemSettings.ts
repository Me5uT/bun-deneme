export const serializeSystemSettings = list => {
  const result = {};

  list.forEach(item => {
    // Check if the parentKey is non-empty and the item should be included
    if (item.parentKey && item.key) {
      // Initialize the parentKey object if it doesn't exist
      if (!result[item.parentKey]) {
        result[item.parentKey] = {};
      }

      // Convert the value to the correct type based on valueType
      // valueType: 0 = string, 1 = number, 2 = boolean
      let value;
      switch (item.valueType) {
        case 1:
          value = Number(item.value);
          break;
        case 2:
          value = item.value === 'true';
          break;
        default:
          value = item.value;
      }

      // Assign the value to the key within the parentKey object
      result[item.parentKey][item.key.toLowerCase().replace(/\s/g, '')] = value;
    }
  });

  return result;
};
