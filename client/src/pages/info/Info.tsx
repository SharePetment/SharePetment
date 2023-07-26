import { ErrorMessage } from '@hookform/error-message';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { fillUserInfo, postQuitMember } from '../../api/mutationfn.ts';
import { SERVER_URL } from '../../api/url.ts';
import { ReactComponent as Like } from '../../assets/button/like.svg';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { ReactComponent as ArrowLeft } from '../../assets/mobile/arrow-left.svg';
import Button from '../../common/button/Button.tsx';
import {
  ErrorNotice,
  FormContainer,
  InputContainer,
  InputText,
  Label,
} from '../../common/input/Input.styled.tsx';
import Popup from '../../common/popup/Popup.tsx';
import Select from '../../common/select/Select.tsx';
import { ConfirmButton, ExtraInfoLogo, InfoForm } from './Info.styled.tsx';

type InfoProps = {
  nickname: string;
  name: string;
  email: string;
  address: string;
  url: string;
  accessToken: string | null;
};

type QuitProps = {
  quitText: string;
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
  const matchInfo = useMatch('/info');

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

  // Submit 핸들러
  const onSubmit = (data: InfoProps) => {
    const url = `${SERVER_URL}/members/status`;

    data = {
      ...data,
      address: zip.trim(),
      url,
      accessToken,
    };

    if (isDuplicated && matchInfo) {
      userInfoFillMutation.mutate(data);
    }

    if (isDuplicated && !userId && matchInfo === null) {
      return setError('nickname', {
        message: ERROR_MESSAGE.DUPLICATE,
      });
    }

    // if (isDuplicated) {
    //   if (!userId) {
    //     return setError('nickname', {
    //       message: ERROR_MESSAGE.DUPLICATE,
    //     });
    //   }
    // }

    if (!isDuplicated) {
      return setError('nickname', {
        type: 'required',
        message: ERROR_MESSAGE.DUPLICATE,
      });
    }

    // userId params가 존재하면 userInfoEditMutation
    userInfoFillMutation.mutate(data);
  };

  /* ---------------------------------- 회원탈퇴---------------------------------- */
  const {
    register: quitRegister,
    handleSubmit: quitHandleSubmit,
    formState: { errors: quitErrors },
  } = useForm<QuitProps>();

  const [isError, setIsError] = useState(false);

  // 회원탈퇴 mutaition
  const userQuitMutation = useMutation({
    mutationFn: postQuitMember,
    onSuccess() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('firstVisited');
      navigate('/');
    },
    onError() {
      setIsError(true);
    },
  });

  const onSubmitQuit = (data: QuitProps) => {
    if (data.quitText) {
      userQuitMutation.mutate({ accessToken });
    }
  };

  if (userId) {
    return (
      <>
        <div
          className="w-[320px] max-sm:w-[220px] mx-auto flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(-1)}>
          <ArrowLeft className="w-7 h-7 stroke-deepgreen" />
          <Logo width="400" className="ml-8 max-sm:w-80 max-sm:mx-auto " />
        </div>
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
              <InputText
                id="email"
                value={
                  location.state.email
                    ? location.state.email
                    : 'guest@email.com'
                }
                disabled
              />
            </InputContainer>

            {/* 주소 */}
            <div>
              <Label>주소</Label>
              <Select size="lg" direction="column" setZip={setZip} />
            </div>
            <Button size="lg" text="회원정보 수정" isgreen="true" />
          </InfoForm>

          {/* 탈퇴버튼 */}
          <div className="flex flex-col items-center gap-1 mt-3">
            <span className="text-xs">
              탈퇴를 원하신다면 '탈퇴할게요'를 적어주세요🥲
            </span>
            <form
              className="flex gap-1"
              onSubmit={quitHandleSubmit(onSubmitQuit)}>
              <input
                className="w-full bg-lightgray p-1 text-xs rounded-md"
                {...quitRegister('quitText', {
                  validate: value =>
                    value === '탈퇴할게요' || '정확하게 입력해주세요',
                })}
              />
              <button className="p-1 text-xs bg-deepgreen flex-shrink-0 rounded-md text-defaultbg">
                확인
              </button>
            </form>
            <p className="text-xs text-rose-500">
              {quitErrors.quitText?.message}
            </p>
          </div>
        </FormContainer>
        {isError && (
          <Popup
            popupcontrol={() => {
              setIsError(false);
            }}
            btnsize={['md']}
            countbtn={1}
            title="실패했습니다. 다시 입력해주세요!"
            isgreen={['true']}
            buttontext={['확인']}
            handler={[
              () => {
                setIsError(false);
              },
            ]}
          />
        )}
      </>
    );
  } else {
    return (
      <>
        <ExtraInfoLogo>
          <Like className="stroke-deepgreen fill-deepgreen w-6 h-6" />
          <span className="ml-2 text-xl font-black">추가정보 입력</span>
        </ExtraInfoLogo>

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
            <Button size="lg" text="회원가입" isgreen="true" />
          </InfoForm>
        </FormContainer>
      </>
    );
  }
}
Component.displayName = 'Info';
