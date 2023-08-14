import { useQuery } from '@tanstack/react-query';
import QueryProp from './queryProp';
import { getServerDataWithJwt } from '@/api/queryfn';

export default function useGetQuery<T>({ key, url, accessToken }: QueryProp) {
  const { data, isLoading, isSuccess, isError } = useQuery<T>({
    queryKey: key,
    queryFn: () => getServerDataWithJwt(url, accessToken as string),
  });
  return { data, isLoading, isSuccess, isError };
}
