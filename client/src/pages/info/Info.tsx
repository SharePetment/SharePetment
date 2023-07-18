import { ErrorMessage } from '@hookform/error-message';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { fillUserInfo } from '../../api/mutationfn';
import { SERVER_URL } from '../../api/url';
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

const ERROR_MESSAGE = {
  NONE: '텍스트 필수입니다.',
  EXTRA: '공백과 특수기호를 제거해주세요.',
  LENGTH: '10자 이내로 작성해주세요.',
  DUPLICATE: '중복을 확인해주세요.',
  EXIST: '이미 아이디가 있습니다.',
  ENABLE: '사용가능한 아이디입니다.',
};

export function Component() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();

  // useHookForm 사용
  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<InfoProps>({ mode: 'onChange' });
  const nicknameValue = watch('nickname');

  // 중복확인 정상적으로 끝내면 true, 아니면 false
  const [isDuplicated, setDuplicated] = useState<boolean>(true);
  // 주소 값 받아오기
  const [zip, setZip] = useState('');

  const accessToken = useReadLocalStorage<string>('accessToken');

  // 회원가입 등록 Mutation
  const userInfoFillMutation = useMutation({
    mutationFn: fillUserInfo,
    onSuccess: () => {
      if (userId) return navigate('/my-page');
      navigate('/home');
    },
    onError: () => {
      navigate('/');
    },
  });

  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  // 중복확인 핸들러
  const handleCheckNickname = async (e: React.MouseEvent) => {
    e.preventDefault();

    // 중복확인할 닉네임이 현재 닉네임과 동일하면 return
    if (location.state.nickname === nicknameValue) {
      setDuplicated(true);
      return;
    }

    if (errors.nickname) {
      if (errors.nickname.message !== ERROR_MESSAGE.DUPLICATE) return;
    }

    const result = await axios.post(
      `${SERVER_URL}/members/nickname-check/${nicknameValue}`,
    );

    if (result.data.enable) {
      setDuplicated(true);
      setError('nickname', { message: ERROR_MESSAGE.ENABLE });
      setValue('nickname', nicknameValue);
    } else {
      setDuplicated(false);
      setError('nickname', { message: ERROR_MESSAGE.EXIST });
    }
  };

  console.log(accessToken);

  // Submit 핸들러
  const onSubmit = (data: InfoProps) => {
    if (isDuplicated) {
      if (!userId)
        return setError('nickname', {
          message: ERROR_MESSAGE.DUPLICATE,
        });
    }

    if (!isDuplicated) {
      return setError('nickname', {
        type: 'required',
        message: ERROR_MESSAGE.DUPLICATE,
      });
    }

    const url = `${SERVER_URL}/members/status`;

    data = {
      ...data,
      address: zip.trim(),
      url,
      accessToken,
    };

    // userId params가 존재하면 userInfoEditMutation
    userInfoFillMutation.mutate(data);
  };

  if (userId) {
    return (
      <>
        {userId ? (
          <Logo
            width="400"
            className="ml-8 max-sm:w-80 max-sm:mx-auto cursor-pointer"
            onClick={() => {
              navigate('/home');
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
              <InputText id="nickname" value={location.state.name} disabled />
            </InputContainer>

            {/* 닉네임*/}
            <InputContainer>
              <Label htmlFor="nickname">닉네임</Label>
              <InputText
                id="nickname"
                {...register('nickname', {
                  required: ERROR_MESSAGE.NONE,
                  pattern: {
                    value: /^(?!.*\s)[\p{L}\p{N}]+$/u,
                    message: ERROR_MESSAGE.EXTRA,
                  },
                  maxLength: {
                    value: 10,
                    message: ERROR_MESSAGE.LENGTH,
                  },
                  onChange: () => setDuplicated(false),
                })}
                error={errors.nickname?.message}
                duplicated={`${isDuplicated}`}
                defaultValue={location.state.nickname}
              />
              <ConfirmButton
                onClick={e => handleCheckNickname(e)}
                isduplicated={`${isDuplicated}`}>
                중복확인
              </ConfirmButton>
              <ErrorMessage
                errors={errors}
                name="nickname"
                render={({ message }) => (
                  <ErrorNotice messagetext={message}>{message}</ErrorNotice>
                )}
              />
            </InputContainer>

            {/* 이메일 */}
            <InputContainer>
              <Label htmlFor="email">이메일</Label>
              <InputText id="email" value={location.state.email} disabled />
            </InputContainer>

            {/* 주소 */}
            <div>
              <Label>주소</Label>
              <Select size="lg" direction="column" setZip={setZip} />
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
  } else {
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
              <InputText id="nickname" value={location.state.name} disabled />
            </InputContainer>

            {/* 닉네임*/}
            <InputContainer>
              <Label htmlFor="nickname">닉네임</Label>
              <InputText
                id="nickname"
                {...register('nickname', {
                  required: ERROR_MESSAGE.NONE,
                  pattern: {
                    value: /^(?!.*\s)[\p{L}\p{N}]+$/u,
                    message: ERROR_MESSAGE.EXTRA,
                  },
                  maxLength: {
                    value: 10,
                    message: ERROR_MESSAGE.LENGTH,
                  },
                  onChange: () => setDuplicated(false),
                })}
                error={errors.nickname?.message}
                duplicated={`${isDuplicated}`}
              />
              <ErrorMessage
                errors={errors}
                name="nickname"
                render={({ message }) => (
                  <ErrorNotice messagetext={message}>{message}</ErrorNotice>
                )}
              />
              <ConfirmButton
                onClick={e => handleCheckNickname(e)}
                isduplicated={`${isDuplicated}`}>
                중복확인
              </ConfirmButton>
            </InputContainer>

            {/* 이메일 */}
            <InputContainer>
              <Label htmlFor="email">이메일</Label>
              <InputText id="email" value={location.state.email} disabled />
            </InputContainer>

            {/* 주소 */}
            <div>
              <Label>주소</Label>
              <Select size="lg" direction="column" setZip={setZip} />
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
}
Component.displayName = 'Info';
