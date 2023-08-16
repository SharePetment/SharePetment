import axios from 'axios';
import { SERVER_URL } from '@/api/url.ts';
import { Subscribe } from '@/types/subscribe.ts';

interface MutationProp {
  url: string;
  accessToken: string | null;
}

export interface Comment extends MutationProp {
  id: string;
  content: string;
  tag: string;
}

interface MethodFormProp extends MutationProp {
  formData: FormData;
}

/* ------------------------------ POST METHOD (FORMDATA)------------------------------ */

export const postFormMuation = async (body: MethodFormProp) => {
  const { formData, url, accessToken } = body;
  const result = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: accessToken,
    },
  });
  return result.data;
};

/* ------------------------------ PATCH METHOD ------------------------------ */
export const patchMutation = async (body: MutationProp) => {
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
  return result;
};

/* ------------------------------ PATCH METHOD (FORMDATA)------------------------------ */

export const patchFormMuation = async (body: MethodFormProp) => {
  const { formData, url, accessToken } = body;
  const result = await axios.patch(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: accessToken,
    },
  });
  return result.data;
};

/* ------------------------------ DELETE METHOD ------------------------------ */
export const deleteMutation = async (body: MutationProp) => {
  const { url, accessToken } = body;
  const result = await axios.delete(url, {
    headers: {
      Authorization: accessToken,
    },
  });
  return result;
};

/* ------------------------------ 피드, 산책 댓글 수정 ------------------------------ */
export const patchComment = async (body: Comment) => {
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
export interface PostComment extends MutationProp {
  content: string;
}

export const postComment = async (body: PostComment) => {
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

/* -------------------------------- 회원 정보 추가 / 수정 -------------------------------- */
export interface PatchUserInfo extends MutationProp {
  nickname: string;
  address: string;
}

export const patchUserInfo = async (body: PatchUserInfo) => {
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

/* -------------------------------- 피드게시물 댓글 작성  -------------------------------- */
interface PostFeedCommentProp extends MutationProp {
  content: string;
  feedId: number;
}

export const postFeedComment = async (body: PostFeedCommentProp) => {
  const { url, accessToken, content, feedId } = body;
  const result = await axios.post(
    url,
    { content, feedId },
    {
      headers: {
        Authorization: accessToken,
      },
    },
  );
  return result;
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
    `${SERVER_URL}/walkmates`,
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

export const postSubscribe = async (body: MutationProp) => {
  const { url, accessToken } = body;
  const result = await axios.post<Subscribe>(
    url,
    {},
    { headers: { Authorization: accessToken } },
  );
  return result.data;
};

/* -------------------------------- 산책 게시물 수정 -------------------------------- */
interface PatchWalkPosProp extends FillWalkPosProp {
  walkId: number;
}

export const patchWalkFeed = async (payload: PatchWalkPosProp) => {
  const { title, content, mapURL, chatURL, location, time, open, maximum } =
    payload;

  const result = await axios.patch(
    `${SERVER_URL}/walkmates/${payload.walkId}`,
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
