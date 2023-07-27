import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import {
  deleteFeedComment,
  patchFeedComment,
} from '../../../api/mutationfn.ts';
import { SERVER_URL } from '../../../api/url.ts';
import { ReactComponent as Write } from '../../../assets/button/write.svg';
import { BooleanStr } from '../../../types/propType.ts';
import Profile from '../../profile/Profile.tsx';
import {
  Container,
  UserBox,
  UserId,
  Time,
  Content,
  EditText,
  EditInput,
  EditBtn,
} from './FeedComment.styled.tsx';

interface Prop {
  feedid: number;
  inperson: BooleanStr;
  nickname: string;
  userimg: string;
  content: string;
  commentid: number;
  blankhandler: React.Dispatch<React.SetStateAction<[boolean, string]>>;
  memberid: number;
  time: string;
}

export default function FeedComment({
  feedid,
  inperson,
  nickname,
  userimg,
  content,
  commentid,
  blankhandler,
  memberid,
  time,
}: Prop) {
  const navigate = useNavigate();
  const accessToken = useReadLocalStorage('accessToken');
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const commentEditMuation = useMutation({
    mutationFn: patchFeedComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['feedPopUp', feedid],
      });
      setIsEditOpen(false);
    },
  });

  const commentDeleteMutation = useMutation({
    mutationFn: deleteFeedComment,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['feedPopUp', feedid],
      }),
  });

  const handleEdit = () => {
    if (inputRef.current) {
      const regex = /^\s*$/;
      if (regex.test(inputRef.current.value))
        return blankhandler([true, '공백은 입력할 수 없어요.']);
      if (inputRef.current.value === '')
        return blankhandler([true, '공백은 입력할 수 없어요.']);
      const body = {
        content: inputRef.current.value.trim(),
        feedId: feedid,
        url: `${SERVER_URL}/feeds/comments/${commentid}`,
        token: accessToken as string,
      };
      commentEditMuation.mutate(body);
    }
  };

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleEdit();
  };

  const handleDelete = () => {
    const body = {
      url: `${SERVER_URL}/feeds/comments/${commentid}`,
      accessToken: accessToken as string,
    };
    commentDeleteMutation.mutate(body);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <UserBox>
        <div
          onClick={() => navigate(`/users/${memberid}`)}
          className="cursor-pointer">
          <Profile size="sm" isgreen="false" url={userimg} />
        </div>
        <UserId onClick={() => navigate(`/users/${memberid}`)}>
          {nickname}
        </UserId>
        <Time>{time}</Time>
        {inperson === 'true' && (
          <div className="flex gap-2 pl-24">
            <EditText onClick={() => setIsEditOpen(prev => !prev)}>
              수정
            </EditText>
            <EditText onClick={handleDelete}>삭제</EditText>
          </div>
        )}
      </UserBox>
      {!isEditOpen && <Content>{content}</Content>}
      {isEditOpen && (
        <div className="relative">
          <EditInput
            defaultValue={content}
            ref={inputRef}
            onKeyUp={e => handleSubmit(e)}
          />
          <EditBtn onClick={handleEdit}>
            <Write width={22} />
          </EditBtn>
        </div>
      )}
    </Container>
  );
}
