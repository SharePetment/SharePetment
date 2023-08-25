import { UseMutateFunction } from '@tanstack/react-query';
import { UseFormSetError } from 'react-hook-form';
import { PathMatch } from 'react-router-dom';
import { PatchUserInfo } from '@/api/mutationfn';
import { SERVER_URL } from '@/api/url';
import ERROR_MESSAGE from '@/types/errorMessage';
import { InfoProps } from '@/types/infoProp';

interface SubmitProp {
  data: InfoProps;
  zip: string;
  accessToken: string | null;
  isDuplicated: boolean;
  matchInfo: PathMatch<string> | null;
  userId: string | undefined;
  setError: UseFormSetError<InfoProps>;
  userInfoFillMutation: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutate: UseMutateFunction<any, unknown, PatchUserInfo, unknown>;
  };
}

const handleOnSubmit = ({
  data,
  zip,
  accessToken,
  isDuplicated,
  matchInfo,
  userId,
  setError,
  userInfoFillMutation,
}: SubmitProp) => {
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

  if (!isDuplicated) {
    return setError('nickname', {
      type: 'required',
      message: ERROR_MESSAGE.DUPLICATE,
    });
  }

  // userId params가 존재하면 userInfoEditMutation
  userInfoFillMutation.mutate(data);
};

export default handleOnSubmit;
