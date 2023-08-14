import { useQuery } from '@tanstack/react-query';
import QueryProp, { DefaultData } from './queryProp';
import { getServerDataWithJwt } from '@/api/queryfn';
import { State } from '@/store/Context';
import { Feed } from '@/types/feedTypes';

interface HostFeedProp extends QueryProp {
  state: State | null;
}

export default function useHostFeedQuery({
  key,
  url,
  accessToken,
  state,
}: HostFeedProp) {
  const { data, isLoading, isSuccess, isError } = useQuery<Feed>({
    queryKey: key,
    queryFn: () => getServerDataWithJwt(url, accessToken as string),
    enabled: !!(state && accessToken),
  });

  return { data: data || DefaultData, isLoading, isSuccess, isError };
}
