import axios, { isAxiosError, AxiosResponse } from 'axios';
export interface Comment {
  id: string;
  content: string;
  url: string;
  tag: string;
}

// 피드, 산책 댓글 수정
export const editComment = async (body: Comment) => {
  const { id, content, url, tag } = body;

  const data =
    tag === 'feed' ? { feedId: id, content } : { walkId: id, content };
  try {
    const result = await axios.patch(url, data);
    return result.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errMessage = (error.response as AxiosResponse<{ message: string }>)
        ?.data.message;
      return errMessage;
    }
  }
};
