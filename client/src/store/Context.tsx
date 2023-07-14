import { useQuery } from '@tanstack/react-query';
import { createContext, useState } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../api/queryfn';
import { SERVER_URL } from '../api/url';
import { UserInfo } from '../types/userType';

type Props = {
  children?: React.ReactNode;
};

export const MemberIdContext = createContext('');

export default function ContextProvider({ children }: Props) {
  const accessToken = useReadLocalStorage('accessToken');
  const [memberId, setMemberId] = useState('');
  // eslint-disable-next-line no-empty-pattern
  const {} = useQuery<UserInfo>({
    queryKey: ['contextApi'],
    queryFn: () =>
      getServerDataWithJwt(`${SERVER_URL}/members`, accessToken as string),
    onSuccess(data) {
      setMemberId(`${data.memberInfo.memberId}`);
    },
  });

  return (
    <MemberIdContext.Provider value={memberId}>
      {children}
    </MemberIdContext.Provider>
  );
}
