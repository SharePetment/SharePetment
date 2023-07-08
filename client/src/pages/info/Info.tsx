import { ErrorMessage } from '@hookform/error-message';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { fillUserInfo, editUserInfo } from '../../api/mutationfn';
import { getUserInfo } from '../../api/queryfn';
import { ReactComponent as Like } from '../../assets/button/like.svg';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import Button from '../../common/button/Button';
import {
  ErrorNotice,
  FormContainer,
  InputContainer,
  InputText,
  Label,
} from '../../common/input/Input.styled';
import Select from '../../common/select/Select';
import {
  ConfirmButton,
  DuplicateNotice,
  ExtraInfoLogo,
  InfoForm,
} from './Info.styled';

type InfoProps = {
  nickname: string;
  name: string;
  email: string;
  address: string;
};

interface IPets {
  petId: number;
  profile: string;
  name: string;
  age: number;
  sex: string;
  species: string;
  information: string;
  memberId: number;
  createdAt: string;
  modifiedAt: string;
}
interface IUserInfo {
  memberId: number;
  kakaoName: string | number | readonly string[] | undefined;
  email: string;
  nickname: string;
  address: string;
  followerCount: number;
  animalParents: boolean;
  guestFollowStatus: boolean;
  pets: IPets[];
  createdAt: number[];
  modifiedAt: number[];
}

export function Component() {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<InfoProps>({ mode: 'onChange' });

  const [noticeMessage, setNoticeMessage] = useState('');
  const nicknameValue = watch('nickname');

  const { userId } = useParams();
  const navigate = useNavigate();

  // const accessToken = useReadLocalStorage('accessToken');

  // 비회원 로그인이 직접적으로 '/info'로 접근했을 때 확인해야 함
  // useEffect(() => {
  //   if (!accessToken) {
  //     navigate('/');
  //   }
  // }, [accessToken, navigate]);

  useEffect(() => {
    if (!nicknameValue?.length) setNoticeMessage('');
  }, [nicknameValue]);

  // 회원정보 가져오기
  // const { data, isLoading } = useQuery<IUserInfo>({
  //   queryKey: ['userInfo'],
  //   queryFn: () => getUserInfo(userId, userId),
  // });

  // 추가정보 등록 POST
  const userInfoFillMutation = useMutation({
    mutationFn: fillUserInfo,
  });

  // 정보 수정 PATCH
  const userInfoEditMutation = useMutation({
    mutationFn: editUserInfo,
  });

  // 중복확인 체크
  const handleCheckNickname = async (e: React.MouseEvent, nickname: string) => {
    e.preventDefault();
    const resultBeforeValidate = await trigger('nickname');
    if (!resultBeforeValidate) return;
    // const result = await axios.post(
    //   'localhost:8080/members/nickname-check',
    //   nickname,
    // );

    // setNoticeMessage(
    //   result.data ? '사용가능한 닉네임입니다.' : '사용불가능한 닉네임입니다. ',
    // );

    setNoticeMessage('사용 불가능한 닉네임입니다.');
  };

  // POST/members
  const onSubmit = (data: InfoProps) => {
    data = { ...data, address: '' };

    // userId params가 존재하면 userInfoEditMutation
    if (userId) userInfoEditMutation.mutate(data);
    else userInfoFillMutation.mutate(data);
  };

  return (
    <>
      {userId ? (
        <Logo
          width="400"
          className="ml-8 max-sm:w-80 max-sm:mx-auto cursor-pointer"
          onClick={() => {
            navigate('/my-page');
          }}
        />
      ) : (
        <ExtraInfoLogo>
          <Like className="stroke-defaulttext fill-defaulttext w-7 h-7" />
          <span className="ml-2 text-3xl font-black">추가정보 입력</span>
        </ExtraInfoLogo>
      )}

      <FormContainer>
        <InfoForm onSubmit={handleSubmit(onSubmit)}>
          {/* 이름 */}
          <InputContainer>
            <Label htmlFor="name">이름</Label>
            <InputText id="nickname" value="김댕댕" disabled />
          </InputContainer>

          {/* 닉네임*/}
          <InputContainer>
            <Label htmlFor="nickname">닉네임</Label>
            <InputText
              id="nickname"
              {...register('nickname', {
                required: '텍스트 필수입니다.',
                pattern: {
                  value: /^(?!.*\s)[\p{L}\p{N}]+$/u,
                  message: '공백과 특수기호를 제거해주세요 ;)',
                },
                maxLength: {
                  value: 10,
                  message: '10자 이내로 작성해주세요 ;)',
                },
              })}
              error={errors.nickname?.message}
            />
            {<DuplicateNotice>{noticeMessage}</DuplicateNotice>}
            <ErrorMessage
              errors={errors}
              name="nickname"
              render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
            />
            <ConfirmButton onClick={e => handleCheckNickname(e, 'nickname')}>
              중복확인
            </ConfirmButton>
          </InputContainer>

          {/* 이메일 */}
          <InputContainer>
            <Label htmlFor="email">이메일</Label>
            <InputText id="email" value="daengdaeng@gmail.com" disabled />
          </InputContainer>

          {/* 주소 */}
          <div>
            <Label>주소</Label>
            <Select size="lg" direction="column" />
          </div>
          <Button
            size="lg"
            text={userId ? '회원정보 수정' : '회원가입'}
            isgreen="true"
          />
        </InfoForm>
      </FormContainer>
    </>
  );
}

Component.displayName = 'Info';
