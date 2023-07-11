import { ErrorMessage } from '@hookform/error-message';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { fillUserInfo, editUserInfo } from '../../api/mutationfn';
// import { getUserInfo } from '../../api/queryfn';
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
import { ConfirmButton, ExtraInfoLogo, InfoForm } from './Info.styled';

type InfoProps = {
  nickname: string;
  name: string;
  email: string;
  address: string;
  url: string;
  accessToken: string | null;
};

// interface IPets {
//   petId: number;
//   profile: string;
//   name: string;
//   age: number;
//   sex: string;
//   species: string;
//   information: string;
//   memberId: number;
//   createdAt: string;
//   modifiedAt: string;
// }

// interface IUserInfo {
//   memberId: number;
//   kakaoName: string | number | readonly string[] | undefined;
//   email: string;
//   nickname: string;
//   address: string;
//   followerCount: number;
//   animalParents: boolean;
//   guestFollowStatus: boolean;
//   pets: IPets[];
//   createdAt: number[];
//   modifiedAt: number[];
// }

export function Component() {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state.name;
  const email = location.state.email;
  const { userId } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm<InfoProps>({ mode: 'onChange' });
  const nicknameValue = watch('nickname');
  const [isDuplicated, setDuplicated] = useState<boolean>(false);
  // 주소 값 받아오기
  const [zip, setZip] = useState('');
  /* ----------------------------- useLocalStorage ---------------------------- */
  const accessToken = useReadLocalStorage<string>('accessToken');

  // TODO: submit 버튼을 눌렀을 때 회원가입이면 POST/members, 회원수정이면 PATCH/members
  const onSubmit = (data: InfoProps) => {
    const url = 'http://43.202.86.53:8080/members';
    data = {
      ...data,
      address: zip.trim(),
      url,
      accessToken,
    };
    console.log(data);
    // 서버에 받은 정보를 가지고 중복확인
    // 중복 응답을 받은 경우, ErrorNotice로 중복된 이름입니다라는 에러보여주기
    // setNoticeMessage('중복된 닉네임입니다.');
    // userId params가 존재하면 userInfoEditMutation
    if (userId) userInfoEditMutation.mutate(data);
    // else userInfoFillMutation.mutate(data);
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  // 추가정보 등록 POST
  const userInfoFillMutation = useMutation({
    mutationFn: fillUserInfo,
    onSuccess: async () => {
      console.log("I'm first!");
    },
  });

  // 정보 수정 PATCH
  const userInfoEditMutation = useMutation({
    mutationFn: editUserInfo,
  });

  // 중복확인 체크
  const handleCheckNickname = async (e: React.MouseEvent) => {
    e.preventDefault();
    const resultBeforeValidate = await trigger('nickname');
    if (errors.nickname?.message === '중복확인을 해주세요.') {
      const result = await axios.post(
        `http://43.202.86.53:8080/members/nickname-check/${nicknameValue}`,
      );
      console.log(result);
      if (result.data.enable) setDuplicated(true);
      clearErrors('nickname');
      console.log(resultBeforeValidate);
    } else setDuplicated(false);
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
          <Like className="stroke-deepgreen fill-deepgreen w-6 h-6" />
          <span className="ml-2 text-xl font-black">추가정보 입력</span>
        </ExtraInfoLogo>
      )}

      <FormContainer>
        <InfoForm onSubmit={handleSubmit(onSubmit)}>
          {/* 이름 */}
          <InputContainer>
            <Label htmlFor="name">이름</Label>
            <InputText id="nickname" value={name} disabled />
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
                  message: '공백과 특수기호를 제거해주세요.',
                },
                maxLength: {
                  value: 10,
                  message: '10자 이내로 작성해주세요.',
                },
              })}
              error={errors.nickname?.message}
              duplicated={`${isDuplicated}`}
              onChange={() => {
                setDuplicated(false);
                setError('nickname', { message: '중복을 확인해주세요.' });
              }}
            />
            <ErrorMessage
              errors={errors}
              name="nickname"
              render={({ message }) => <ErrorNotice>{message}</ErrorNotice>}
            />
            <ConfirmButton onClick={e => handleCheckNickname(e)}>
              중복확인
            </ConfirmButton>
          </InputContainer>

          {/* 이메일 */}
          <InputContainer>
            <Label htmlFor="email">이메일</Label>
            <InputText id="email" value={email} disabled />
          </InputContainer>

          {/* 주소 */}
          <div>
            <Label>주소</Label>
            <Select size="lg" direction="column" setZip={setZip} />
          </div>
          <Button
            size="lg"
            text={userId ? '회원정보 수정' : '회원가입'}
            isgreen={`${isDuplicated}`}
          />
        </InfoForm>
      </FormContainer>
    </>
  );
}

Component.displayName = 'Info';
