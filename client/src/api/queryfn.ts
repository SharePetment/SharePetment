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

/* -------------------------------- 서버에서 데이터 가지고 오기 with jwt ------------------------------- */

export const getServerDataWithJwt = async (url: string, token: string) => {
  const result = await axios.get(url, {
    headers: {
      Authorization: token,
    },
  });
  return result.data;
};

/* -------------------------------- 게스트 피드리스트 가져오기 ------------------------------- */
export const getGuestFeedList = async (
  url: string,
  memberId: string | null,
) => {
  if (memberId === null) memberId = '0';
  const result = await axios.post(`${url}/${memberId}`, {
    previousListIds: [0],
  });
  return result.data;
};

/* -------------------------------- 기존 유저 피드리스트 가져오기 ------------------------------- */
export const getHostFeedList = async (
  url: string,
  accessToken: string | null,
) => {
  const result = await axios.post(
    url,
    {
      previousListIds: [0],
    },
    {
      headers: {
        Authorization: accessToken,
      },
    },
  );
  return result.data;
};

/* ------------------------------- 산책 리스트 가져오기 ------------------------------ */
export const getWalkmateList = async () => {
  const URL = 'http://43.202.86.53:8080';
  const result = await axios.get(`${URL}/walkmates/walks`);
  return result.data;
};
