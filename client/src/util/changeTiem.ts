import moment from 'moment';

const changeTime = (dateArr: number[]) => {
  const date = dateArr.slice(0, dateArr.length - 1).map((item, index) => {
    if (index === 1) {
      return Number(item) - 1;
    } else if (index === 3) {
      const newHour =
        Number(item) + 9 > 24 ? Number(item) + 9 - 24 : Number(item) + 9;
      return newHour;
    } else {
      return Number(item);
    }
  });
  const today = moment();
  const postingDate = moment(date);

  const dayDiff = postingDate.diff(today, 'days');
  const hourDiff = postingDate.diff(today, 'hours');
  const minutesDiff = postingDate.diff(today, 'minutes');

  if (dayDiff === 0 && hourDiff === 0) {
    const minutes = Math.ceil(-minutesDiff);
    return `${minutes}분 전`;
  }
  if (dayDiff === 0 && hourDiff <= 24) {
    const hours = Math.ceil(-hourDiff);
    return `${hours}시간 전`;
  }
  return `${-dayDiff}일 전`;
};

export default changeTime;
