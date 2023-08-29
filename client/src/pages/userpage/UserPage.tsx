import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useContext, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams, Navigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '@/api/queryfn.ts';
import { SERVER_URL } from '@/api/url.ts';
import FollowList from '@/components/follow-list/FollowList.tsx';
import LoadingComponent from '@/components/loading/LoadingComponent.tsx';
import PetContainerList from '@/components/my-page-and-user-page/pet-container-list/PetContainerList';
import Tab from '@/components/my-page-and-user-page/tab/Tab';
import TabDetail from '@/components/my-page-and-user-page/tab-detail/TabDetail';
import UserBox from '@/components/my-page-and-user-page/user-box/UserBox';
import NoticeServerError from '@/components/notice/NoticeServerError.tsx';
import useGetQuery from '@/hook/api/query/useGetQuery';
import useMypageQuery from '@/hook/api/query/useMypageQuery';
import * as SC from '@/pages/userpage/userPage.styled.tsx';
import Path from '@/routers/paths.ts';
import { MemberIdContext } from '@/store/Context.tsx';
import { Feed } from '@/types/feedTypes.ts';
import { Follow } from '@/types/userType';
import { WalkFeed } from '@/types/walkType.ts';

export function Component() {
  const { usersId } = useParams();

  const memberId = useContext(MemberIdContext);

  const accessToken = useReadLocalStorage<string | null>('accessToken');

  // 구독 controller
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  // userList 보여주기 & 팔로잉 리스트 보여주기
  const [isListShowed, setIsListShowed] = useState(false);
  // active 탭 state
  const [currentTab, setCurrentTab] = useState(0);

  const handleOpenFollowingList = () => {
    setIsListShowed(true);
  };

  // (타)유저 데이터 가지고 오기
  const {
    data,
    isLoading,
    isError: isUserError,
  } = useMypageQuery({
    key: ['userPage', usersId as string],
    url: `${SERVER_URL}/members/${usersId}`,
    accessToken,
    booleanFn: setIsSubscribed,
  });

  // (본인) 유저 데이터 가지고 오기
  const { data: myData } = useMypageQuery({
    url: `${SERVER_URL}/members`,
    accessToken,
  });

  // 유저가 작성한 피드 리스트 가져오기
  const feedListInView = useInView();
  const {
    data: feedData,
    isLoading: feedLoading,
    isError: isFeedError,
    fetchNextPage: feedFetchNextPage,
  } = useInfiniteQuery<Feed[]>({
    queryKey: ['userFeed', usersId],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getServerDataWithJwt(
        `${SERVER_URL}/feeds/other-feed/${usersId}?page=${pageParam}&size=10`,
        accessToken as string,
      );
      return result.responseList;
    },
    getNextPageParam: (_, allPages) => {
      const len = allPages.length;
      const totalLength = allPages.length;
      return allPages[totalLength - 1].length === 0 ? undefined : len;
    },
  });

  /* ---------------------------- useInfiniteQuery ---------------------------- */
  // 유저가 작성한 산책 리스트 가져오기
  const walkListInView = useInView();
  const {
    data: walkFeedData,
    fetchNextPage: walkFetchNextPage,
    isError: isWalkFeedError,
  } = useInfiniteQuery<WalkFeed[]>({
    queryKey: ['UserwalkFeedList'],
    queryFn: ({ pageParam = 0 }) => {
      return getServerDataWithJwt(
        `${SERVER_URL}/walkmates/other-walks/${usersId}?openFilter=false&&page=${pageParam}&size=10`,
        accessToken as string,
      );
    },

    getNextPageParam: (_, allPages) => {
      const len = allPages.length;
      const totalLength = allPages.length;
      return allPages[totalLength - 1].length === 0 ? undefined : len;
    },
  });

  useEffect(() => {
    if (walkListInView.inView) {
      walkFetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walkListInView.inView]);

  useEffect(() => {
    if (feedListInView.inView) {
      feedFetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedListInView.inView]);

  // 팔로잉 회원 리스트 조회
  const { data: followingData, isLoading: followingLoading } = useGetQuery<
    Follow[]
  >({
    key: ['followList', usersId as string],
    url: `${SERVER_URL}/members/following/list/${usersId}`,
    accessToken,
  });

  // memberId, usersId가 같을시 myPage로 이동
  if (usersId === memberId?.memberId) {
    return <Navigate to={Path.MyPage} />;
  }

  // 찾는 유저가 없을 시 혹은 에러 발생시
  if (isUserError) {
    return (
      <div className="flex h-screen w-screen items-center justify-center ">
        <NoticeServerError />
      </div>
    );
  }

  // 로딩시 화면 처리
  if (isLoading || feedLoading || followingLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <SC.Container>
        {/* 유저info */}
        <UserBox
          data={data}
          followingData={followingData}
          handleOpenFollowingList={handleOpenFollowingList}
          type="userPage"
          isSubscribed={isSubscribed}
          usersId={usersId}
        />

        {/* pet info */}
        <PetContainerList data={data} type="userPage" />

        {/* tab - 피드, 산책 */}
        <SC.ListBox>
          <Tab
            type="userPage"
            setCurrentTab={setCurrentTab}
            currentTab={currentTab}
          />
          <div>
            {/* 피드 */}
            <div className={currentTab === 0 ? 'block' : 'hidden'}>
              <TabDetail
                feedData={feedData}
                type="feed"
                ref={feedListInView.ref}
                isError={isFeedError}
              />
            </div>
            {/* 산책 게시물 */}
            <div className={currentTab === 1 ? 'block' : 'hidden'}>
              <TabDetail
                walkData={walkFeedData}
                type="walkFeed"
                ref={walkListInView.ref}
                isError={isWalkFeedError}
                isPet={myData?.animalParents}
              />
            </div>
          </div>
        </SC.ListBox>
      </SC.Container>
      {isListShowed && (
        <FollowList
          setIsListShowed={setIsListShowed}
          follow={followingData}
          path={'user'}
        />
      )}
    </>
  );
}

Component.displayName = 'UserPage';
