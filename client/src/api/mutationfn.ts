import axios from 'axios';
import { Subscribe } from '../types/subscribe';
import { SERVER_URL } from './url';

export interface Comment {
  id: string;
  content: string;
  url: string;
  tag: string;
  accessToken: string | null;
}

/* ------------------------------ 피드, 산책 댓글 수정 ------------------------------ */
export const editComment = async (body: Comment) => {
  const { id, content, url, tag, accessToken } = body;

  const data = tag === 'feed' ? { feedId: id, content } : { content };

  const result = await axios.patch(url, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
  });
  return result.data;
};

/* -------------------------------- 산책 댓글 생성 -------------------------------- */
export interface AddComment {
  content: string;
  url: string;
  accessToken: string | null;
}
export const addComment = async (body: AddComment) => {
  const { content, url, accessToken } = body;

  const result = await axios.post(
    url,
    { content },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
    },
  );

  return result.data;
};

/* -------------------------------- 산책 댓글 삭제 -------------------------------- */
export interface DeleteComment {
  url: string;
  accessToken: string | null;
}
export const deleteComment = async (body: DeleteComment) => {
  const { url, accessToken } = body;

  const result = await axios.delete(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: accessToken,
    },
  });

  return result.data;
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

  const result = await axios.patch(
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

/* -------------------------------- 펫 등록, 수정 -------------------------------- */
// 로직 분리하기
type PostPetProp = {
  formData: FormData;
  url: string;
  accessToken: string;
};

export const postPet = async (body: PostPetProp) => {
  const { formData, url, accessToken } = body;
  const result = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: accessToken,
    },
  });
  return result.data;
};

export const patchPet = async (body: PostPetProp) => {
  const { formData, url, accessToken } = body;
  const result = await axios.patch(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: accessToken,
    },
  });
  return result.data;
};

/* -------------------------------- 펫 삭제 -------------------------------- */
interface DeletePetProp {
  url: string;
  token: string;
}
export const deletePet = async (body: DeletePetProp) => {
  const { url, token } = body;
  const result = await axios.delete(url, {
    headers: {
      Authorization: token,
    },
  });
  return result;
};

/* -------------------------------- 유저 프로필 변경-------------------------------- */
interface PatchUserProfileProp {
  url: string;
  accessToken: string;
}
export const patchUserProfile = async (body: PatchUserProfileProp) => {
  const { url, accessToken } = body;
  const result = await axios.patch(
    url,
    {},
    {
      headers: {
        Authorization: accessToken,
      },
    },
  );
  return result.data.imageURL;
};

/* -------------------------------- 피드게시물 생성 -------------------------------- */
interface FeedPostingProp {
  url: string;
  accessToken: string | null;
  formData: FormData;
}
export const feedPosting = async (body: FeedPostingProp) => {
  const { url, accessToken, formData } = body;
  const result = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: accessToken,
    },
  });
  return result.data;
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
  accessToken: string;
}

export const postWalkFeed = async (payload: FillWalkPosProp) => {
  const { title, content, mapURL, chatURL, location, time, open, maximum } =
    payload;

  const result = await axios.post(
    `${SERVER_URL}walkmates`,
    {
      title,
      content,
      mapURL,
      chatURL,
      location,
      time,
      open,
      maximum,
    },
    {
      headers: {
        Authorization: payload.accessToken,
      },
    },
  );
  return result.data;
};

/* -------------------------------- 구독 갱신 -------------------------------- */
interface SubscribeProp {
  url: string;
  accessToken: string;
}
export const postSubscribe = async (body: SubscribeProp) => {
  const { url, accessToken } = body;
  const result = await axios.post<Subscribe>(
    url,
    {},
    { headers: { Authorization: accessToken } },
  );
  return result.data;
};
