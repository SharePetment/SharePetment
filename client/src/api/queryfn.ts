// eslint-disable-next-line import/named
import axios, { isAxiosError } from 'axios';
import { ZIP_URL } from './url';

// 쿼리함수를 관리합니다.

//시군구 정보 가져오기
export const getLocal = async (pattern: string) => {
  try {
    const result = await axios.get(`${ZIP_URL}${pattern}`);
    return result.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errMessage = error.message;
      return errMessage;
    } else {
      return error;
    }
  }
};

/* -------------------------------- 서버에서 데이터 가지고 오기 ------------------------------- */

export const getServerData = async (url: string) => {
  const result = await axios.get(url);
  return result.data;
};

// JWT accessToken 필요
export const getServerDataWithJWT = async (
  url: string,
  token: string | null,
) => {
  const result = await axios.get(url, {
    headers: {
      Authorization: token,
    },
  });
  return result.data;
};
