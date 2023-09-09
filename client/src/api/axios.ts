/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from 'axios';
import { postTokenRefesh } from '@/api/queryfn';
import { RefreshToken } from '@/types/tokenApiType';

export const EXPIRED_TIME = 1000 * 60 * 60 * 23;

export const refresgInterceptor = async (
  config: AxiosRequestConfig,
): Promise<any> => {
  const expiresIn = window.localStorage.getItem('expiresTime');

  // 만료시간이 없을 경우
  if (expiresIn === null) return config;

  const now = Date.now();
  const expiresDate = Number(expiresIn.replace(/\D/g, '')) + EXPIRED_TIME;

  // 만료시간이 현재 시간보다 큰 경우

  if (expiresDate >= now) return config;

  // 만료시간보다 현재 시간이 큰 경우
  if (expiresDate < now) {
    window.localStorage.setItem('expiresTime', `${Date.now() + EXPIRED_TIME}`);
    const { accessToken, refreshToken } =
      (await postTokenRefesh()) as RefreshToken;
    window.localStorage.setItem('accessToken', JSON.stringify(accessToken));
    window.localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

    return config;
  } else {
    return config;
  }
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(refresgInterceptor);

export default axiosInstance;
