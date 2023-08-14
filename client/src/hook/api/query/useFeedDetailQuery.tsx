import { useQuery } from '@tanstack/react-query';
import QueryProp, { DefaultData } from './queryProp';
import { getServerDataWithJwt } from '@/api/queryfn';
import { Feed, FeedImage } from '@/types/feedTypes';

interface FeedDetailProp extends QueryProp {
  feedId: number;
  firstFn: React.Dispatch<React.SetStateAction<string[]>>;
  secondFn: React.Dispatch<React.SetStateAction<(File | FeedImage)[]>>;
  booleanFn: React.Dispatch<React.SetStateAction<boolean>>;
  textRef: React.RefObject<HTMLTextAreaElement>;
  firstEnable: string[];
  secondEnable: boolean;
}

export default function useFeedDetailQuery({
  feedId,
  url,
  accessToken,
  firstFn,
  secondFn,
  booleanFn,
  textRef,
  firstEnable,
  secondEnable,
}: FeedDetailProp) {
  const { data, isLoading, isSuccess, isError, isFetching } = useQuery<Feed>({
    queryKey: ['feedPopUp', feedId],
    queryFn: async () => {
      const result = await getServerDataWithJwt(url, accessToken as string);
      result.images.map((image: FeedImage) => {
        firstFn(prev => [...prev, image.uploadFileURL]);
        secondFn(prev => [...prev, image]);
        booleanFn(true);
      });

      if (textRef.current) {
        textRef.current.value = result.content;
      }
      return result;
    },
    enabled: !!feedId && firstEnable.length === 0 && !secondEnable,
  });

  return {
    data: data || DefaultData,
    isLoading,
    isSuccess,
    isError,
    isFetching,
  };
}
