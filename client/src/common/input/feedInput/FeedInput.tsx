import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { postFeedComment } from '../../../api/mutationfn.ts';
import { SERVER_URL } from '../../../api/url.ts';
import { ReactComponent as Write } from '../../../assets/button/write.svg';
import { Container, Input, CommentBtn } from './FeedInput.styled.tsx';

interface Prop {
  feedid: number;
  blankhandler: React.Dispatch<React.SetStateAction<[boolean, string]>>;
}

export default function FeedInput({ feedid, blankhandler }: Prop) {
  const accessToken = useReadLocalStorage('accessToken');
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: postFeedComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['feedPopUp', feedid],
      });
    },
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
        token: accessToken as string,
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
    <Container>
      <Input
        ref={inputRef}
        type="text"
        onKeyUp={e => handleSubmit(e)}
        placeholder="댓글을 입력해주세요."
      />
      <CommentBtn onClick={handleClick}>
        <Write />
      </CommentBtn>
    </Container>
  );
}
