import axios, { isAxiosError } from 'axios';
import { Subscribe } from '../types/subscribe';
import { SERVER_URL } from './url';
export interface Comment {
  id: string;
  content: string;
  url: string;
  tag: string;
}

/* ------------------------------ 피드, 산책 댓글 수정 ------------------------------ */
export const editComment = async (body: Comment) => {
  const { id, content, url, tag } = body;

  const data =
    tag === 'feed' ? { feedId: id, content } : { walkId: id, content };
  try {
    const result = await axios.patch(url, data);
    return result.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errMessage = error.message;
      console.log(errMessage);
      return errMessage;
    }
  }
};

/* -------------------------------- 회원 정보 추가 / 수정 -------------------------------- */
export interface UserInfo {
  nickname: string;
  address: string;
  url: string;
  accessToken: string | null;
}

export const fillUserInfo = async (body: UserInfo) => {
  const { nickname, address, url, accessToken } = body;

  const result = await axios.post(
    url,
    { nickname, address },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    },
  );
  return result.data;
};

export const editUserInfo = async (body: UserInfo) => {
  const { nickname, address } = body;
  const url = '';

  try {
    const result = await axios.patch(url, { nickname, address });
    return result.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errMessage = error.message;
      console.log(errMessage);
      return errMessage;
    } else {
      return error;
    }
  }
};

/* -------------------------------- 펫 등록, 수정 -------------------------------- */
// 로직 분리하기
type PostPetProp = {
  formData: FormData;
  method: 'post' | 'patch';
  url: string;
};

export const postPet = async (body: PostPetProp) => {
  const { formData, method, url } = body;

  try {
    if (method === 'post') {
      const result = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return result.data;
    }
    if (method === 'patch') {
      const result = await axios.patch(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return result.data;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      const errMessage = error.message;
      console.log(errMessage);
      return errMessage;
    } else {
      return error;
    }
  }
};

/* -------------------------------- 유저 프로필 변경-------------------------------- */
export const patchUserProfile = async (url: string) => {
  const result = await axios.patch(
    url,
    {},
    {
      withCredentials: true,
    },
  );
  return result.data.imageURL;
};

/* -------------------------------- 산책게시물 생성 -------------------------------- */
interface FillWalkPosProp {
  title: string;
  content: string;
  mapURL: string;
  chatURL: string;
  location: string;
  time: string;
  open: boolean;
  maximum: number;
  memberId: number;
}

export const fillWalkPost = async (payload: FillWalkPosProp) => {
  const { title, content, mapURL, chatURL, location, time, open, maximum } =
    payload;
  const url = '';

  const result = await axios.post(`${url}/walkmates/${payload.memberId}`, {
    title,
    content,
    mapURL,
    chatURL,
    location,
    time,
    open,
    maximum,
  });
  return result.data;
};

/* -------------------------------- 구독 갱신 -------------------------------- */
export const postSubscribe = async (url: string) => {
  const result = await axios.post<Subscribe>(`${SERVER_URL}${url}`);
  return result.data;
};
