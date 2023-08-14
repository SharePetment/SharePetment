import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import QueryProp from './queryProp';
import { getServerDataWithJwt } from '@/api/queryfn';
import Path from '@/routers/paths';
import { WalkFeed } from '@/types/walkType';

interface WalkFeedProp extends QueryProp {
  postId: string | undefined;
  successFn: React.Dispatch<React.SetStateAction<string>>[];
  errorFn?: boolean;
  type: 'edit' | 'feed';
}

export default function useWalkFeedQuery({
  url,
  accessToken,
  postId,
  type,
  successFn,
  errorFn,
}: WalkFeedProp) {
  const navigate = useNavigate();
  const { data, isLoading, isSuccess, isError } = useQuery<WalkFeed>({
    queryKey: ['walkFeed', postId],
    queryFn: () => getServerDataWithJwt(url, accessToken as string),
    onSuccess: data => {
      if (type === 'edit') {
        successFn[0](data.location);
        successFn[1](data.mapURL.split(' ')[2]);
      } else if (type === 'feed') {
        successFn[0](
          (data?.location as string) + ' ' + data?.mapURL.split(' ')[2],
        );
        successFn[1](data?.mapURL.split(' ')[0]);
        successFn[2](data?.mapURL.split(' ')[1]);
      }
    },
    onError: () => {
      if (errorFn) navigate(Path.WalkMate);
    },
  });

  return { data, isLoading, isSuccess, isError };
}
