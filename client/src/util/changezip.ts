export const changeCountryCode = (code: string) => {
  const pattern = /(\d{2})(\d{4})(\d+)/;
  return code.replace(pattern, '$1*$200');
};
export const changeCityCode = (code: string) => {
  const pattern = /(\d{4})(\d+)/;
  return code.replace(pattern, '$1*');
};
