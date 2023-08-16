export default function throttling() {
  let timerId: undefined | number | string | NodeJS.Timeout;
  // 기본 쓰로틀 시간 1초로 설정
  function throttl(func: () => void, timeout = 1000) {
    if (timerId) {
      return;
    }

    timerId = setTimeout(() => {
      func();
      timerId = undefined;
    }, timeout);
  }
  return throttl;
}
