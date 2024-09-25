// parametre olarak beforeFunctionDelay ve afterFunctionDelay alıyor.
// beforeFunctionDelay: fonksiyon çağrılmadan önce ne kadar beklemesi gerektiği
// afterFunctionDelay: fonksiyon çağrıldıktan sonra ne kadar beklemesi gerektiği
// parametre olarak da fonksiyon alıyor.
// fonksiyonun dönüş değeri varsa onu da dönmeli.

export const delayFunction = async (fn: () => any, beforeFunctionDelay: number, afterFunctionDelay: number) => {
  // Fonksiyon çağrılmadan önce bekle
  await new Promise(resolve => setTimeout(resolve, beforeFunctionDelay));

  // Fonksiyonu çağır ve sonucunu sakla
  const result = await fn();

  // Fonksiyon çağrıldıktan sonra bekle
  await new Promise(resolve => setTimeout(resolve, afterFunctionDelay));

  // Fonksiyonun dönüş değerini döndür
  return result;
};
