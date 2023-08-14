import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getServerDataWithJwt, getServerData } from '@/api/queryfn';
import Path from '@/routers/paths';
import { State } from '@/store/Context';
import { Feed, FeedImage } from '@/types/feedTypes';
import { UserInfo } from '@/types/userType';
import { WalkFeed } from '@/types/walkType';

interface QueryProp {
  key?: (string | number)[];
  url: string;
  accessToken: string | null;
}

interface MypageQueryProp extends QueryProp {
  successFn?: React.Dispatch<React.SetStateAction<string>>;
  booleanFn?: React.Dispatch<React.SetStateAction<boolean>>;
  parameter?: 'address' | 'image' | 'guest';
}

interface HostFeedProp extends QueryProp {
  state: State | null;
}

interface WalkFeedProp extends QueryProp {
  postId: string | undefined;
  successFn: React.Dispatch<React.SetStateAction<string>>[];
  errorFn?: boolean;
  type: 'edit' | 'feed';
}

interface FeedDetailProp extends QueryProp {
  feedId: number;
  firstFn: React.Dispatch<React.SetStateAction<string[]>>;
  secondFn: React.Dispatch<React.SetStateAction<(File | FeedImage)[]>>;
  booleanFn: React.Dispatch<React.SetStateAction<boolean>>;
  textRef: React.RefObject<HTMLTextAreaElement>;
  firstEnable: string[];
  secondEnable: boolean;
}

/* ------------------------------ useGetQuery ------------------------------ */
export function useGetQuery<T>({ key, url, accessToken }: QueryProp) {
  const { data, isLoading, isSuccess, isError } = useQuery<T>({
    queryKey: key,
    queryFn: () => getServerDataWithJwt(url, accessToken as string),
  });
  return { data, isLoading, isSuccess, isError };
}

/* ------------------------------ key: ['myPage'] ------------------------------ */
export function useMypageQuery({
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

/* ------------------------------ key: ['guestFeedPopUp'] ------------------------------ */
/* ------------------------------ key: ['feedPopUp'] ------------------------------ */
const defaultData: Feed = {
  feedId: 0,
  memberInfo: {
    memberId: 0,
    nickname: '',
    imageURL: '',
  },
  images: [],
  content: '',
  likes: 0,
  feedComments: null,
  shareURL: '',
  createdAt: [],
  modifiedAt: [],
  isLike: false,
};

export function useGuestFeedQuery<T>({ key, url, accessToken }: QueryProp) {
  const { data, isLoading, isSuccess, isError } = useQuery<T>({
    queryKey: key,
    queryFn: () => getServerData(url),
    enabled: !!(accessToken === null),
  });

  return { data: data || defaultData, isLoading, isSuccess, isError };
}

export function useHostFeedQuery({
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

  return { data: data || defaultData, isLoading, isSuccess, isError };
}

/* ------------------------------ key: ['walkFeed'] ------------------------------ */
export function useWalkFeedQuery({
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

/* ---------------------- key: ['feedPopUp', Number(feedId)] --------------------------- */

export function useFeedDetailQuery({
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
    data: data || defaultData,
    isLoading,
    isSuccess,
    isError,
    isFetching,
  };
}
