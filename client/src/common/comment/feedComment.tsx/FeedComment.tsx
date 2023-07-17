import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { deleteFeedComment, patchFeedComment } from '../../../api/mutationfn';
import { SERVER_URL } from '../../../api/url';
import { ReactComponent as Write } from '../../../assets/button/write.svg';
import { BooleanStr } from '../../../types/propType';
import Profile from '../../profile/Profile';
import {
  Container,
  UserBox,
  UserId,
  Time,
  Content,
  EditText,
  EditTextarea,
  EditBtn,
} from './FeedComment.styled';

interface Prop {
  feedid: number;
  inperson: BooleanStr;
  nickname: string;
  userimg: string;
  content: string;
  commentid: number;
  blankhandler: React.Dispatch<React.SetStateAction<boolean>>;
  memberid: number;
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
      if (inputRef.current.value === '') return blankhandler(true);
      const body = {
        content: inputRef.current.value,
        feedId: feedid,
        url: `${SERVER_URL}/feeds/comments/${commentid}`,
        token: accessToken as string,
      };
      commentEditMuation.mutate(body);
    }
  };

  const handleDelete = () => {
    const body = {
      url: `${SERVER_URL}/feeds/comments/${commentid}`,
      accessToken: accessToken as string,
    };
    commentDeleteMutation.mutate(body);
  };

  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Container>
      <UserBox onClick={() => navigate(`/users/${memberid}`)}>
        <Profile size="sm" isgreen="false" url={userimg} />
        <UserId>{nickname}</UserId>
        <Time>몇시간전</Time>
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
          <EditTextarea defaultValue={content} ref={inputRef} />
          <EditBtn onClick={handleEdit}>
            <Write width={22} />
          </EditBtn>
        </div>
      )}
    </Container>
  );
}
