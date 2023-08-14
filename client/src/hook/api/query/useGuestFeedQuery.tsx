import { useQuery } from '@tanstack/react-query';
import QueryProp, { DefaultData } from './queryProp';
import { getServerData } from '@/api/queryfn';

export default function useGuestFeedQuery<T>({
  key,
  url,
  accessToken,
}: QueryProp) {
  const { data, isLoading, isSuccess, isError } = useQuery<T>({
    queryKey: key,
    queryFn: () => getServerData(url),
    enabled: !!(accessToken === null),
  });

  return { data: data || DefaultData, isLoading, isSuccess, isError };
}
