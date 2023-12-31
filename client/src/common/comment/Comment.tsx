import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useReadLocalStorage } from 'usehooks-ts';
import AlertText from '../popup/AlertText';
import { SERVER_URL } from '@/api/url.ts';
import { ReactComponent as Write } from '@/assets/button/write.svg';
import * as SC from '@/common/comment/comment.styled';
import CommentHeader from '@/common/comment/CommentHeader';
import Popup from '@/common/popup/Popup';
import UseDeleteCommentMutation from '@/hook/api/mutation/useDeleteCommentMutation';
import UsePatchCommentMutation from '@/hook/api/mutation/usePatchCommentMutation';
import { CommentProp } from '@/types/commentType.ts';

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
    feedPostId,
    type,
  } = props;

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
    patchCommenMutation.mutate(postData);
  };

  // 산책 댓글 삭제
  const handleDeleteComment = (id: number | undefined) => {
    const data = {
      url:
        type === 'walk'
          ? `${SERVER_URL}/walkmates/comments/${id}`
          : `${SERVER_URL}/feeds/comments/${id}`,
      accessToken,
    };
    deleteCommentMutaion.mutate(data);
  };

  const onSubmit: SubmitHandler<Inputs> = data => handleEditText(data);

  useEffect(() => {
    setFocus('comment');
  }, [setFocus, isEdited]);

  // patchmutation
  const patchCommenMutation =
    type === 'walk'
      ? UsePatchCommentMutation({
          id: walkMatePostId,
          uniqueKey: 'walkFeed',
          setIsEdited,
          setIsCommentError,
        })
      : UsePatchCommentMutation({
          id: feedPostId,
          uniqueKey: 'feedPopUp',
          setIsEdited,
          setIsCommentError,
        });

  const deleteCommentMutaion =
    type === 'walk'
      ? UseDeleteCommentMutation({
          id: walkMatePostId,
          uniqueKey: 'walkFeed',
          setIsDeletError,
        })
      : UseDeleteCommentMutation({
          id: feedPostId,
          uniqueKey: 'feedPopUp',
          setIsDeletError,
        });

  return (
    <>
      <SC.Container>
        <div>
          {/* 유저 정보 기입 */}
          <CommentHeader
            memberId={memberId}
            imageURL={imageURL}
            nickname={nickname}
            createdAt={createdAt}
            setIsEdited={setIsEdited}
            setIsDeleted={setIsDeleted}
          />
          {/* 댓글 작성 */}
          <SC.ContentBox>
            {isEdited ? (
              <SC.Form onSubmit={handleSubmit(onSubmit)}>
                <SC.Input
                  defaultValue={text}
                  {...register('comment', {
                    required: '텍스트 필수',
                    maxLength: 100,
                    validate: value =>
                      value.trim().length !== 0 || '공백만 안됨',
                  })}
                />
                <SC.WriteBtn>
                  <Write
                    type="submit"
                    className={
                      errors.comment?.message === undefined
                        ? 'stroke-black cursor-pointer'
                        : 'stroke-lightgray cursor-default'
                    }
                  />
                </SC.WriteBtn>
              </SC.Form>
            ) : (
              <SC.Content>{content}</SC.Content>
            )}
          </SC.ContentBox>
        </div>
      </SC.Container>
      {isDeleted && (
        <Popup
          title={AlertText.Delete}
          handler={[
            () => {
              //delete 메서드 진행
              setIsDeleted(false);
              handleDeleteComment(
                type === 'walk' ? walkMateCommentId : feedCommentsId,
              );
            },
            () => {
              //delete 메서드 진행
              setIsDeleted(false);
            },
          ]}
          countbtn={2}
          popupcontrol={() => {
            setIsDeleted(false);
          }}
        />
      )}
      {isCommentError && (
        <Popup
          title={AlertText.Failed}
          handler={[
            () => {
              setFocus('comment');
              setIsCommentError(false);
            },
          ]}
          popupcontrol={() => {
            setFocus('comment');
            setIsCommentError(false);
          }}
        />
      )}
      {isDeleteError && (
        <Popup
          title={AlertText.Failed}
          handler={[
            () => {
              setIsDeletError(false);
            },
          ]}
          popupcontrol={() => {
            setIsDeletError(false);
          }}
        />
      )}
    </>
  );
}
