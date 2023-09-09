import axiosInstance from '@/api/axios';
import { SERVER_URL, ZIP_URL } from '@/api/url';
import { RefreshToken } from '@/types/tokenApiType';

// 쿼리함수를 관리합니다.

//시군구 정보 가져오기
export const getLocal = async (pattern: string) => {
  const result = await axiosInstance.get(`${ZIP_URL}${pattern}`);
  return result.data;
};

/* -------------------------------- 서버에서 데이터 가지고 오기 ------------------------------- */

export const getServerData = async (url: string) => {
  const result = await axiosInstance.get(url);
  return result.data;
};

/* -------------------------------- 서버에서 데이터 가지고 오기 with jwt ------------------------------- */

export const getServerDataWithJwt = async (
  url: string,
  token: string | null | undefined,
) => {
  const result = await axiosInstance.get(url, {
    headers: {
      Authorization: token,
    },
  });
  return result.data;
};

/* -------------------------------- 게스트 피드리스트 가져오기 ------------------------------- */
export const getGuestFeedList = async (url: string) => {
  const result = await axiosInstance.post(url);
  return result.data.responseList;
};

/* -------------------------------- 기존 유저 피드리스트 가져오기 ------------------------------- */
export const getHostFeedList = async (
  url: string,
  token: string | null | undefined,
) => {
  const result = await axiosInstance.post(
    url,
    {},
    {
      headers: {
        Authorization: token,
      },
    },
  );
  return result.data.responseList;
};

/* ------------------- 서버에서 데이터 가지고 오기 with jwt 무한 스크롤을 위한 데이터 ------------------------------- */

export const getServerDataWithJwtScroll = async (
  url: string,
  token: string | null | undefined,
) => {
  const result = await getServerDataWithJwt(url, token);
  return result.responseList;
};

/* ------------------- accessToken 갱신 ------------------------------- */

export const postTokenRefesh = async () => {
  let refresh = window.localStorage.getItem('refreshToken')?.toString();
  let access = window.localStorage.getItem('accessToken')?.toString();
  refresh = refresh?.replace(/[''""]/g, '').slice(7) as string;
  access = access?.replace(/[''""]/g, '').slice(7) as string;

  try {
    const result = await axiosInstance.post<RefreshToken>(
      `${SERVER_URL}/refresh`,
      {
        refreshToken: refresh,
        accessToken: access,
      },
    );

    const { accessToken, refreshToken } = result.data;

    return { accessToken, refreshToken };
  } catch (err) {
    alert('로그인이 만료되었습니다. 다시 로그인을 부탁드립니다. 😥');
    window.localStorage.removeItem('expiresTime');
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  }
};
