import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { postFeedComment } from '../../../api/mutationfn';
import { SERVER_URL } from '../../../api/url';
import { ReactComponent as Write } from '../../../assets/button/write.svg';
import { Container, Input, CommentBtn } from './FeedInput.styled';

interface Prop {
  feedid: number;
  blankhandler: React.Dispatch<React.SetStateAction<boolean>>;
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
      if (inputRef.current.value === '') return blankhandler(true);
      const data = {
        url: `${SERVER_URL}/feeds/comments`,
        token: accessToken as string,
        content: inputRef.current.value,
        feedId: feedid,
      };
      mutate(data);
      inputRef.current.value = '';
    }
  };

  return (
    <Container>
      <Input ref={inputRef} type="text" />
      <CommentBtn onClick={handleClick}>
        <Write />
      </CommentBtn>
    </Container>
  );
}
