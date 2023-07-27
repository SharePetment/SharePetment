import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { deleteComment, editComment } from '../../api/mutationfn.ts';
import { SERVER_URL } from '../../api/url.ts';
import { ReactComponent as Write } from '../../assets/button/write.svg';
import { MemberIdContext, State } from '../../store/Context.tsx';
import { CommentProp } from '../../types/commentType.ts';
import changeTime from '../../util/changeTime.ts';
import Popup from '../popup/Popup.tsx';
import Profile from '../profile/Profile.tsx';
import {
  Container,
  ContentBox,
  DateText,
  UserBox,
  UserName,
  EditBtn,
  DeleteBtn,
  BtnBox,
  Content,
  HeaderBox,
  Input,
  WriteBtn,
  Form,
} from './comment.styled';

type Inputs = {
  comment: string;
};

export default function Comment(props: CommentProp) {
  const {
    memberInfo: { memberId, imageURL, nickname },
    createdAt,
    content,
    feedCommentsId,
    walkMateCommentId,
    walkMatePostId,
  } = props;

  const { memberId: userId } = useContext(MemberIdContext) as State;
  const accessToken = useReadLocalStorage<string | null>('accessToken');

  const [isEdited, setIsEdited] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [text] = useState(content);

  // 댓글 수정 실패 팝업
  const [isCommentError, setIsCommentError] = useState(false);
  //댓글 삭제 실패 팝업
  const [isDeleteError, setIsDeletError] = useState(false);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<Inputs>({ mode: 'onChange' });

  // useHookForm 댓글 수정
  const handleEditText = (data: Inputs) => {
    const newComment = data.comment.trim();
    const postData = {
      id: feedCommentsId ? `${feedCommentsId}` : `${walkMateCommentId}`,
      content: newComment,
      url: feedCommentsId
        ? `${SERVER_URL}/feeds/comments/${feedCommentsId}`
        : `${SERVER_URL}/walkmates/comments/${walkMateCommentId}`,
      tag: feedCommentsId ? 'feed' : 'walk',
      accessToken,
    };
    mutation.mutate(postData);
  };

  // 산책 댓글 삭제
  const handleDeleteComment = (walkMateCommentId: number | undefined) => {
    const data = {
      url: `${SERVER_URL}/walkmates/comments/${walkMateCommentId}`,
      accessToken,
    };
    deleteCommentMutaion.mutate(data);
  };

  const onSubmit: SubmitHandler<Inputs> = data => handleEditText(data);

  useEffect(() => {
    setFocus('comment');
  }, [setFocus, isEdited]);

  const queryClient = useQueryClient();
  // mutation
  const mutation = useMutation({
    mutationFn: editComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walkFeed', walkMatePostId] });
      setIsEdited(false);
    },
    onError: () => {
      setIsCommentError(true);
    },
  });

  const deleteCommentMutaion = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walkFeed', walkMatePostId] });
    },
    onError: () => {
      setIsDeletError(true);
    },
  });

  return (
    <>
      <Container>
        <div>
          {/* 유저 정보 기입 */}
          <HeaderBox>
            <Link to={`/users/${memberId}`} className="hover:cursor-pointer">
              <UserBox>
                <Profile size="sm" url={imageURL} isgreen={'false'} />
                <UserName>{nickname}</UserName>
                <DateText>{changeTime(createdAt)}</DateText>
              </UserBox>
            </Link>
            {userId === `${memberId}` && (
              <BtnBox>
                <EditBtn
                  onClick={() => {
                    setIsEdited(prev => !prev);
                  }}>
                  수정
                </EditBtn>
                <DeleteBtn
                  onClick={() => {
                    setIsDeleted(true);
                  }}>
                  삭제
                </DeleteBtn>
              </BtnBox>
            )}
          </HeaderBox>
          {/* 댓글 작성 */}
          <ContentBox>
            {isEdited ? (
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  defaultValue={text}
                  {...register('comment', {
                    required: '텍스트 필수',
                    maxLength: 100,
                    validate: value =>
                      value.trim().length !== 0 || '공백만 안됨',
                  })}
                />
                <WriteBtn>
                  <Write
                    type="submit"
                    className={
                      errors.comment?.message === undefined
                        ? 'stroke-black cursor-pointer'
                        : 'stroke-lightgray cursor-default'
                    }
                  />
                </WriteBtn>
              </Form>
            ) : (
              <Content>{content}</Content>
            )}
          </ContentBox>
        </div>
      </Container>
      {isDeleted && (
        <Popup
          title="정말로 삭제하시겠습니까?"
          handler={[
            () => {
              //delete 메서드 진행
              setIsDeleted(false);
              handleDeleteComment(walkMateCommentId);
            },
            () => {
              //delete 메서드 진행
              setIsDeleted(false);
            },
          ]}
          btnsize={['md', 'md']}
          buttontext={['확인', '취소']}
          isgreen={['true', 'false']}
          countbtn={2}
          popupcontrol={() => {
            setIsDeleted(false);
          }}
        />
      )}
      {isCommentError && (
        <Popup
          title="댓글 수정에 실패했습니다."
          handler={[
            () => {
              setFocus('comment');
              setIsCommentError(false);
            },
          ]}
          btnsize={['md']}
          buttontext={['확인']}
          isgreen={['true']}
          countbtn={1}
          popupcontrol={() => {
            setFocus('comment');
            setIsCommentError(false);
          }}
        />
      )}
      {isDeleteError && (
        <Popup
          title="댓글 삭제에 실패했습니다."
          handler={[
            () => {
              setIsDeletError(false);
            },
          ]}
          btnsize={['md']}
          buttontext={['확인']}
          isgreen={['true']}
          countbtn={1}
          popupcontrol={() => {
            setIsDeletError(false);
          }}
        />
      )}
    </>
  );
}
