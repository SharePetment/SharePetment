import { ErrorMessage } from '@hookform/error-message';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { fillWalkPost } from '../../api/mutationfn';
import { ReactComponent as Close } from '../../assets/button/close.svg';
import Button from '../../common/button/Button';
import {
  ErrorNotice,
  InputContainer,
  InputText,
  Label,
} from '../../common/input/Input.styled';
import { Textarea } from '../../components/card/feedwritecard/FeedWriteCard.styled';
import { PostForm } from './WalkPosting.styled';

export function Component() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 산책게시물 등록 POST
  const walkPostFillMutation = useMutation({
    mutationFn: fillWalkPost,
    onSuccess: () => {
      console.log('success');
    },
    onError: () => {
      console.log(errors);
    },
  });

  const onSumbit = (data: any) => {
    data = { ...data, mapURL: '', open: false, memberId: 1 };
    console.log(data);
    walkPostFillMutation.mutate(data);
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-7 mt-16 mb-7">
        <h2 className=" text-defaulttext font-[800] text-2xl">
          산책 메이트 글쓰기
        </h2>
        <Close
          className=" stroke-defaulttext fill-defaulttext w-6 h-6 cursor-pointer"
          onClick={() => navigate('/walkmate')}
        />
      </div>

      <PostForm onSubmit={handleSubmit(onSumbit)}>
        {/* 제목 */}
        <InputContainer>
          <Label htmlFor="title">제목</Label>
          <InputText
            id="title"
            {...register('title', {
              required: '텍스트 필수입니다.',
              maxLength: {
                value: 20,
                message: '20자 이내로 작성해주세요 ;)',
              },
            })}
            error={errors.title?.message}
          />
          <ErrorMessage
            errors={errors}
            name="title"
            render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
          />
        </InputContainer>

        {/* 날짜 */}
        <InputContainer>
          <Label htmlFor="time">날짜를 선택해주세요</Label>
          <InputText
            id="time"
            className=" cursor-pointer"
            type="datetime-local"
            {...register('time', {
              required: '날짜도 필수입니다.',
              maxLength: {
                value: 20,
                message: '20자 이내로 작성해주세요 ;)',
              },
            })}
            error={errors.time?.message}
          />
          <ErrorMessage
            errors={errors}
            name="time"
            render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
          />
        </InputContainer>

        {/* 장소 */}
        <InputContainer>
          <Label htmlFor="location">산책 장소를 알려주세요</Label>
          <InputText
            className=" cursor-pointer"
            id="location"
            type="text"
            readOnly
            value="의정부시 의정부동 8-51 야쿠르트"
            onClick={() => console.log('his')}
            {...register('location', {
              required: '장소를 선택해주세요!',
            })}
            error={errors.location?.message}
          />
          <ErrorMessage
            errors={errors}
            name="location"
            render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
          />
        </InputContainer>

        {/* 오픈채팅 url */}
        <InputContainer>
          <Label htmlFor="chatURL">오픈채팅방 링크</Label>
          <InputText
            id="chatURL"
            type="text"
            placeholder="(필수X)채팅방 링크가 있다면 입력해주세요:) "
            {...register('chatURL')}
            error={errors.chatURL?.message}
          />
          <ErrorMessage
            errors={errors}
            name="chatURL"
            render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
          />
        </InputContainer>

        {/* 산책 마리수 */}
        <InputContainer>
          <Label htmlFor="maximum">산책 친구들은 몇 마리면 좋을까요?</Label>
          <InputText
            id="maximum"
            type="number"
            {...register('maximum', {
              required: '필수',
              min: {
                value: 1,
                message: '1마리 이상이어야해요!',
              },
            })}
            error={errors.maximum?.message}
          />
          <ErrorMessage
            errors={errors}
            name="maximum"
            render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
          />
        </InputContainer>

        {/* 텍스트 입력창 */}
        <Textarea
          placeholder="글을 작성해주세요"
          {...register('content', {
            maxLength: 300,
          })}
        />

        <Button size="lg" text="게시물 작성" isgreen="true" />
      </PostForm>
    </div>
  );
}

Component.displayName = 'WalkPosting';
