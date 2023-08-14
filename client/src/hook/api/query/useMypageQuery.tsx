import { useQuery } from '@tanstack/react-query';
import QueryProp from './queryProp';
import { getServerDataWithJwt } from '@/api/queryfn';
import { UserInfo } from '@/types/userType';

interface MypageQueryProp extends QueryProp {
  successFn?: React.Dispatch<React.SetStateAction<string>>;
  booleanFn?: React.Dispatch<React.SetStateAction<boolean>>;
  parameter?: 'address' | 'image' | 'guest';
}

export default function useMypageQuery({
  key,
  url,
  accessToken,
  successFn,
  booleanFn,
  parameter,
}: MypageQueryProp) {
  const { data, isLoading, isSuccess, isError } = useQuery<UserInfo>({
    queryKey: key ? key : ['myPage'],
    queryFn: () => getServerDataWithJwt(url, accessToken as string),
    onSuccess: data => {
      if (successFn) {
        if (parameter === 'address') successFn(data.address);
        else if (parameter === 'image') successFn(data.memberInfo.imageURL);
      }
      if (booleanFn) booleanFn(data.guestFollow);
    },
    enabled: !!accessToken,
  });

  return { data, isLoading, isSuccess, isError };
}
