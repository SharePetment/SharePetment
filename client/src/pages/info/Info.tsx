import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { SERVER_URL } from '@/api/url.ts';
import { ReactComponent as Like } from '@/assets/button/like.svg';
import { ReactComponent as Logo } from '@/assets/logo.svg';
import { ReactComponent as ArrowLeft } from '@/assets/mobile/arrow-left.svg';
import AlertText from '@/common/popup/AlertText';
import Popup from '@/common/popup/Popup.tsx';
import FormBox from '@/components/info-page/FormBox';
import useDeleteMutation from '@/hook/api/mutation/useDeleteMutation';
import usePatchUserInfoMutation from '@/hook/api/mutation/usePatchUserInfoMutation';
import * as SC from '@/pages/info/Info.styled.tsx';
import Path from '@/routers/paths.ts';
import { InfoProps, QuitProps } from '@/types/infoProp';
import handleOnSubmit from '@/util/submitInfo';

export function Component() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();
  const matchInfo = useMatch(Path.Info);
  const accessToken = useReadLocalStorage<string | null>('accessToken');

  // 중복확인 정상적으로 끝내면 true, 아니면 false
  const [isDuplicated, setDuplicated] = useState<boolean>(true);

  // 회원탈퇴 에러
  const [isError, setIsError] = useState(false);

  // 주소 값 받아오기
  const [zip, setZip] = useState('');

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

  const {
    register: quitRegister,
    handleSubmit: quitHandleSubmit,
    formState: { errors: quitErrors },
  } = useForm<QuitProps>();

  // 회원가입 등록 Mutation
  const userInfoFillMutation = usePatchUserInfoMutation({
    successFn: () => {
      if (userId) return navigate(Path.MyPage);
      navigate(Path.Home);
    },
    errorFn: () => navigate(Path.Login),
  });

  // 회원탈퇴 Mutation
  const userQuitMutation = useDeleteMutation({
    successFn: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('firstVisited');
      navigate(Path.Login);
    },
    errorFn: () => setIsError(true),
  });

  // Submit 핸들러
  const onSubmit = (data: InfoProps) =>
    handleOnSubmit({
      data,
      zip,
      accessToken,
      isDuplicated,
      matchInfo,
      userId,
      setError,
      userInfoFillMutation,
    });

  // 회원탈퇴 핸들러
  const onSubmitQuit = (data: QuitProps) => {
    if (data.quitText) {
      const body = {
        url: `${SERVER_URL}/auth/kakao/unlink`,
        accessToken,
      };
      userQuitMutation.mutate(body);
    }
  };

  if (userId) {
    return (
      <>
        <SC.CloseBtn onClick={() => navigate(-1)}>
          <ArrowLeft className="w-7 h-7 stroke-deepgreen" />
          <Logo width="400" className="ml-8 max-sm:w-80 max-sm:mx-auto " />
        </SC.CloseBtn>
        <FormBox
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          location={location}
          isDuplicated={isDuplicated}
          setDuplicated={setDuplicated}
          setZip={setZip}
          errors={errors}
          setError={setError}
          setValue={setValue}
          nicknameValue={nicknameValue}
          quitErrors={quitErrors}
          quitHandleSubmit={quitHandleSubmit}
          onSubmitQuit={onSubmitQuit}
          quitRegister={quitRegister}
          userId={undefined}
        />
        {isError && (
          <Popup
            title={AlertText.Failed}
            popupcontrol={() => {
              setIsError(false);
            }}
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
        <SC.ExtraInfoLogo>
          <Like className="stroke-deepgreen fill-deepgreen w-6 h-6" />
          <SC.Additional>추가정보 입력</SC.Additional>
        </SC.ExtraInfoLogo>

        <FormBox
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          location={location}
          isDuplicated={isDuplicated}
          setDuplicated={setDuplicated}
          setZip={setZip}
          errors={errors}
          setError={setError}
          setValue={setValue}
          nicknameValue={nicknameValue}
          quitErrors={quitErrors}
          quitHandleSubmit={quitHandleSubmit}
          onSubmitQuit={onSubmitQuit}
          quitRegister={quitRegister}
          userId={undefined}
        />
      </>
    );
  }
}
Component.displayName = 'Info';
