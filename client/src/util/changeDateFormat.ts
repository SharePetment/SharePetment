export const changeDateFormat = (date: string) => {
  const day = ['일', '월', '화', '수', '목', '금', '토'];

  const originalDate = new Date(date);

  const dateFormat =
    `${originalDate.getFullYear()}` +
    '-' +
    (originalDate.getMonth() + 1) +
    '-' +
    originalDate.getDate() +
    ' ' +
    day[originalDate.getDay()] +
    ' ' +
    originalDate.getHours() +
    '시 ' +
    originalDate.getMinutes() +
    '분';
  return dateFormat;
};
