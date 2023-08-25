import axios from 'axios';
import { FieldErrors, UseFormSetValue, UseFormSetError } from 'react-hook-form';
import { Location } from 'react-router-dom';
import { SERVER_URL } from '@/api/url';
import ERROR_MESSAGE from '@/types/errorMessage';
import { InfoProps } from '@/types/infoProp';

interface CheckNickNameProp {
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>;
  location: Location;
  nicknameValue: string;
  setDuplicated: React.Dispatch<React.SetStateAction<boolean>>;
  setError: UseFormSetError<InfoProps>;
  setValue: UseFormSetValue<InfoProps>;
  errors: FieldErrors<InfoProps>;
}

const handleCheckNickname = async ({
  e,
  location,
  nicknameValue,
  setDuplicated,
  errors,
  setError,
  setValue,
}: CheckNickNameProp) => {
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

export default handleCheckNickname;
