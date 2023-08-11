import { useQuery } from '@tanstack/react-query';
import { getServerDataWithJwt } from '@/api/queryfn';
import { UserInfo } from '@/types/userType';

interface QueryProp {
  url: string;
  accessToken: string | null;
  successFn?: React.Dispatch<React.SetStateAction<string>>;
}

export function useMypageQuery({ url, accessToken, successFn }: QueryProp) {
  const { data, isLoading, isSuccess, isError } = useQuery<UserInfo>({
    queryKey: ['myPage'],
    queryFn: () => getServerDataWithJwt(url, accessToken as string),
    onSuccess: data => {
      if (successFn) successFn(data.memberInfo.imageURL);
    },
    enabled: !!accessToken,
  });

  return { data, isLoading, isSuccess, isError };
}
