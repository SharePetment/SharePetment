/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useReadLocalStorage } from 'usehooks-ts';
import { SERVER_URL } from '@/api/url';

type Prop = {
  enabledValue: string | null;
  queryKey:
    | 'guestFeed'
    | 'hostFeed'
    | 'myFeed'
    | 'walkFeedList'
    | 'walkmateList'
    | 'walkmateListAdvertise';
  fn: (url: string, token?: string | null) => Promise<any>;
  zip?: string;
};

/*
getHostFeedList
getGuestFeedList
getServerDataWithJwt
*/

export default function UseInfinityScroll<T>({
  enabledValue,
  queryKey,
  fn,
  zip,
}: Prop) {
  const queryClient = useQueryClient();
  const accessToken = useReadLocalStorage<string | null>('accessToken');

  const { ref, inView } = useInView();

  const { data, fetchNextPage, isSuccess, isError, isLoading, refetch } =
    useInfiniteQuery<T[]>({
      queryKey: [queryKey],
      staleTime: 600000,
      refetchOnMount: 'always',
      cacheTime: 600000,
      queryFn: ({ pageParam = 0 }) => {
        let url = ``;

        switch (queryKey) {
          case 'guestFeed': {
            url = `${SERVER_URL}/feeds/all/list/random?page=${pageParam}&size=10`;
            break;
          }
          case 'hostFeed': {
            url = `${SERVER_URL}/feeds/list?page=${pageParam}&size=10`;
            break;
          }
          case 'myFeed': {
            url = `${SERVER_URL}/feeds/my-feed?page=${pageParam}&size=10`;
            break;
          }
          case 'walkFeedList': {
            url = `${SERVER_URL}/walkmates/my-walks?openFilter=false&&page=${pageParam}&size=10`;
            break;
          }
          case 'walkmateList': {
            url = `${SERVER_URL}/walkmates/walks?openFilter=false&location=${zip}&page=${pageParam}&size=10`;

            break;
          }
          case 'walkmateListAdvertise': {
            url = `${SERVER_URL}/walkmates/walks?openFilter=true&location=${zip}&page=${pageParam}&size=10`;
            break;
          }
        }

        return fn(url, accessToken);
      },
      getNextPageParam: (_, allPages) => {
        const len = allPages.length;
        const totalLength = allPages.length;
        return allPages[totalLength - 1].length === 0 ? undefined : len;
      },
      enabled:
        queryKey === 'guestFeed' ? enabledValue === null : !!enabledValue,
      onSuccess: () => {
        if (queryKey === 'hostFeed') {
          queryClient.invalidateQueries({ queryKey: ['contextApi'] });
        }
      },
    });

  return {
    data,
    fetchNextPage,
    isSuccess,
    isError,
    isLoading,
    refetch,
    ref,
    inView,
  };
}
