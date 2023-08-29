import { useRef } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { SERVER_URL } from '@/api/url.ts';
import { ReactComponent as Write } from '@/assets/button/write.svg';
import * as SC from '@/common/input/feedInput/FeedInput.styled';
import usePostFeedCommentMutation from '@/hook/api/mutation/usePostFeedCommentMutation';

interface Prop {
  feedid: number;
  blankhandler: React.Dispatch<React.SetStateAction<[boolean, string]>>;
}

export default function FeedInput({ feedid, blankhandler }: Prop) {
  const accessToken = useReadLocalStorage<string | null>('accessToken');
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate } = usePostFeedCommentMutation({
    key: ['feedPopUp', feedid],
  });

  const handleClick = () => {
    if (inputRef.current) {
      const regex = /^\s*$/;
      if (regex.test(inputRef.current.value))
        return blankhandler([true, '공백은 입력할 수 없어요.']);
      if (inputRef.current.value === '')
        return blankhandler([true, '공백은 입력할 수 없어요.']);
      const data = {
        url: `${SERVER_URL}/feeds/comments`,
        accessToken,
        content: inputRef.current.value.trim(),
        feedId: feedid,
      };
      mutate(data);
      inputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputRef.current?.value !== '') handleClick();
    }
  };

  return (
    <SC.Container>
      <SC.Input
        ref={inputRef}
        type="text"
        onKeyUp={e => handleSubmit(e)}
        placeholder="댓글을 입력해주세요."
      />
      <SC.CommentBtn onClick={handleClick}>
        <Write />
      </SC.CommentBtn>
    </SC.Container>
  );
}
