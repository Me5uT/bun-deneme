export const downloadRadiusGatewayURL =
  'https://workdrive.mirketsecurity.com/external/42bc5bca8e346727ad65f603cf166deda33dc763ffc66fa2fbebc7017ca454c3';

export const downloadLDAPGatewayURL =
  'https://workdrive.mirketsecurity.com/external/b1b27b07dcebc98671f12a2a2f5ff3847375fb6b00708863df289542fb27a659';

export const downloadBase64AsXls = (base64: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = `data:application/vnd.ms-excel;base64,${base64}`;
  link.download = `${fileName}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const base64ToString = (base64Data: any) => {
  // Base64 verisini normal string'e dönüştür
  const byteCharacters = atob(base64Data);
  let resultString = '';
  for (let i = 0; i < byteCharacters.length; i++) {
    resultString += String.fromCharCode(byteCharacters.charCodeAt(i));
  }

  return resultString;
};

export const downloadBase64AsJsonFile = (base64Data: any, fileName = 'config') => {
  // Base64 verisini çöz ve JSON formatına dönüştür
  const byteCharacters = atob(base64Data);
  console.log(byteCharacters);
  let jsonString = '';
  for (let i = 0; i < byteCharacters.length; i++) {
    jsonString += String.fromCharCode(byteCharacters.charCodeAt(i));
  }

  try {
    const jsonObject = JSON.parse(jsonString);

    // JSON verisini blob olarak oluştur
    const blob = new Blob([JSON.stringify(jsonObject, null, 2)], { type: 'application/json' });

    // Blob nesnesini json dosyası olarak indirmek için bir link oluştur ve tıkla
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Geçersiz JSON formatı:', error);
  }
};

export const downloadBase64AsZipFile = (base64Data: any, fileName = 'radius-gateway') => {
  // Base64 verisini Blob nesnesine dönüştür
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/zip' });

  // Blob nesnesini zip dosyası olarak indirmek için bir link oluştur ve tıkla
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadJsonFile = (jsonData: any, fileName = 'config') => {
  const jsonString = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.json`; //'config.json';
  link.click();

  URL.revokeObjectURL(url); // Bellek sızıntısını önlemek için URL'i iptal et
};

export const goToDownloadRadiusGateway = () => {
  window.open(downloadRadiusGatewayURL, '_blank', 'noopener,noreferrer');
};

export const goToDownloadLDAPGateway = () => {
  window.open(downloadLDAPGatewayURL, '_blank', 'noopener,noreferrer');
};
