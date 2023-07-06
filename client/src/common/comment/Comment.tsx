import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocalStorage } from 'usehooks-ts';
import { editComment } from '../../api/mutationfn';
import { ReactComponent as Write } from '../../assets/button/write.svg';
import { CommentProp } from '../../types/commentType';
import changeTime from '../../util/changeTiem';
import Popup from '../popup/Popup';
import Profile from '../profile/Profile';
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
    memberInfo: { memberId, imageUrl, nickname },
    createdAt,
    content,
    feedCommentsId,
    walkMatePostId,
  } = props;
  const [userId] = useLocalStorage('userId', '');
  const [isEdited, setIsEdited] = useState(false);
  const [text, setText] = useState(content);

  // mutation

  // useHookForm 댓글 수정
  const handleEditText = (data: Inputs) => {
    const newComment = data.comment;
    const postData = {
      id: feedCommentsId ? `${feedCommentsId}` : `${walkMatePostId}`,
      content: newComment,
      url: feedCommentsId
        ? `/feeds/comments/${feedCommentsId}/${memberId}`
        : `/walkmates/comments/${walkMatePostId}/${memberId}`,
      tag: feedCommentsId ? 'feed' : 'walk',
    };
    mutation.mutate(postData);
  };

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = data => handleEditText(data);
  useEffect(() => {
    setFocus('comment');
  }, [setFocus, isEdited]);

  // mutation
  const mutation = useMutation({
    mutationFn: editComment,
    onSuccess(data) {
      setText(data.content);
    },
  });
  // popUP
  const [isDeleted, setIsDeleted] = useState(false);
  return (
    <>
      <Container>
        <div>
          {/* 유저 정보 기입 */}
          <HeaderBox>
            <UserBox>
              <Profile size="sm" url={imageUrl} isgreen={'false'} />
              <UserName>{nickname}</UserName>
              <DateText>{changeTime(createdAt)}</DateText>
            </UserBox>
            {userId === `${memberId}` ||
              (true && (
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
              ))}
          </HeaderBox>
          {/* 댓글 작성 */}
          <ContentBox>
            {isEdited ? (
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  defaultValue={text}
                  {...register('comment', {
                    required: true,
                    maxLength: 100,
                    minLength: 10,
                    pattern: /^\S(.*\S)?$/gm,
                  })}
                />
                {errors.comment && (
                  <span>문장의 양끝에 공백이 있으면 안됩니다.</span>
                )}
                <WriteBtn>
                  <Write type="submit" />
                </WriteBtn>
              </Form>
            ) : (
              <Content>{content}</Content>
            )}
          </ContentBox>
        </div>
      </Container>
      {mutation.isError && (
        <Popup
          title="댓글 수정에 실패했습니다."
          handler={[
            () => {
              window.location.reload();
            },
          ]}
          btnsize={['md']}
          buttontext={['확인']}
          isgreen={['true']}
          countbtn={1}
          popupcontrol={() => {
            window.location.reload();
          }}
        />
      )}
      {isDeleted && (
        <Popup
          title="정말로 삭제하시겠습니까?"
          handler={[
            () => {
              //delete 메서드 진행
              setIsDeleted(false);
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
    </>
  );
}
