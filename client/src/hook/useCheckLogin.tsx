import { useQuery } from '@tanstack/react-query';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../api/queryfn';
import { SERVER_URL } from '../api/url';
import { UserInfo } from '../types/userType';

const useCheckLogin = () => {
  const accessToken = useReadLocalStorage('accessToken');
  const { data } = useQuery<UserInfo>({
    queryKey: ['myPage'],
    queryFn: () =>
      getServerDataWithJwt(`${SERVER_URL}/members`, accessToken as string),
  });
  return { isLogin: data?.animalParents };
};

export default useCheckLogin;
