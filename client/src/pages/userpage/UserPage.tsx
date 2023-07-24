import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React, { useState, useContext, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../../api/queryfn.ts';
import { SERVER_URL } from '../../api/url.ts';
import { ReactComponent as FeedIcon } from '../../assets/feed.svg';
import { ReactComponent as WalkFeedIcon } from '../../assets/walk-feed.svg';
import Profile from '../../common/profile/Profile.tsx';
import WalkCard from '../../components/card/walk-card/walkCard.tsx';
import FollowList from '../../components/follow-list/FollowList.tsx';
import LoadingComponent from '../../components/loading/LoadingComponent.tsx';
import NoticeNotWrite from '../../components/notice/NoticeNotWrite.tsx';
import NoticeOnlyOwner from '../../components/notice/NoticeOnlyOwner.tsx';
import NoticeServerError from '../../components/notice/NoticeServerError.tsx';
import Subscribe from '../../components/subscribe/Subscribe.tsx';
import PetInfoBox from '../../components/user_my_page/petinfo-box/PetInfoBox.tsx';
import { MemberIdContext } from '../../store/Context.tsx';
import { Feed } from '../../types/feedTypes.ts';
import { Follow, UserInfo } from '../../types/userType.ts';
import { WalkFeed } from '../../types/walkType.ts';
import { changeDateFormat } from '../../util/changeDateFormat.ts';
import {
  GridContainerFeed,
  GridContainerWalk,
  TabMenu,
  TabMenuList,
} from '../myPage/myPage.styled.tsx';
import {
  Container,
  HightliteText,
  ListBox,
  PetBox,
  UserBox,
  UserInfoBox,
  UserName,
  UserNameBox,
} from './userPage.styled.tsx';

export function Component() {
  const { usersId } = useParams();

  const memberId = useContext(MemberIdContext);

  const accessToken = useReadLocalStorage<string>('accessToken');

  // 구독 controller
  const [isSubscribed, setIsSubscribed] = useState(false);
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
  } = useQuery<UserInfo>({
    queryKey: ['userPage', usersId],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/members/${usersId}`,
        accessToken as string,
      ),
    onSuccess(data) {
      setIsSubscribed(data.guestFollow);
    },
  });

  // (본인) 유저 데이터 가지고 오기
  const { data: myData } = useQuery<UserInfo>({
    queryKey: ['myPage'],
    queryFn: () =>
      getServerDataWithJwt(`${SERVER_URL}/members`, accessToken as string),
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
  const { data: followingData, isLoading: followingLoading } = useQuery<
    Follow[]
  >({
    queryKey: ['followList', usersId],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/members/following/list/${usersId}`,
        accessToken as string,
      ),
  });

  // memberId, usersId가 같을시 myPage로 이동
  if (usersId === memberId?.memberId) {
    return <Navigate to="/my-page" />;
  }

  // 찾는 유저가 없을 시 혹은 에러 발생시
  if (isUserError) {
    return (
      <div className="flex h-screen w-screen items-center justify-center ">
        <NoticeServerError />
      </div>
    );
  }
  return (
    <>
      {!(!isLoading && !feedLoading && !followingLoading) ? (
        <LoadingComponent />
      ) : (
        <>
          <Container>
            {/* 유저info */}
            <UserBox>
              <Profile
                isgreen="true"
                size="lg"
                url={
                  typeof data?.memberInfo === 'object'
                    ? data?.memberInfo.imageURL
                    : ''
                }
              />
              <UserNameBox className="flex items-center gap-4">
                <UserName>{data?.memberInfo.nickname}</UserName>
                <Subscribe guestFollow={isSubscribed} usersId={usersId} />
              </UserNameBox>
              <UserInfoBox>
                <div>
                  <span>게시물 </span>
                  <HightliteText>{data?.feedCount || 0}</HightliteText>
                </div>
                <div>
                  <span>랜선집사</span>
                  <HightliteText> {data?.followerCount || 0}</HightliteText>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={handleOpenFollowingList}>
                  <span>구독 </span>
                  <HightliteText>{followingData?.length || 0}</HightliteText>
                </div>
              </UserInfoBox>
            </UserBox>
            {/* pet info */}
            <PetBox>
              {Array.isArray(data?.pets) && (
                <>
                  {data?.pets.map(
                    (
                      { images: { uploadFileURL }, name, information, sex },
                      index,
                    ) => (
                      <PetInfoBox
                        key={index}
                        name={name}
                        information={information}
                        sex={sex}
                        uploadFileURL={uploadFileURL}
                      />
                    ),
                  )}
                </>
              )}
            </PetBox>
            {/* tab - 피드, 산책 */}
            <ListBox>
              <TabMenu>
                <TabMenuList
                  onClick={() => setCurrentTab(0)}
                  className={
                    currentTab === 0
                      ? `border-t-2 border-t-[green] `
                      : undefined
                  }>
                  <FeedIcon
                    stroke={currentTab === 0 ? `#69B783` : '#d4d4d8'}
                    className="cursor-pointer"
                  />
                </TabMenuList>
                <TabMenuList
                  onClick={() => setCurrentTab(1)}
                  className={
                    currentTab === 1 ? `border-t-2 border-t-[green]` : undefined
                  }>
                  <WalkFeedIcon
                    fill={currentTab === 1 ? `#69B783` : '#d4d4d8'}
                    className="cursor-pointer"
                  />
                </TabMenuList>
              </TabMenu>
              <div>
                {/* 피드 */}
                <div className={currentTab === 0 ? 'block' : 'hidden'}>
                  <div>
                    {feedData === undefined ? (
                      <>
                        {isFeedError ? (
                          <NoticeServerError />
                        ) : (
                          <NoticeNotWrite />
                        )}
                      </>
                    ) : (
                      <>
                        <GridContainerFeed>
                          {feedData.pages.map((page, index) => (
                            <React.Fragment key={index}>
                              {page.map(item => (
                                <Link
                                  to={`/home/${item.feedId}`}
                                  key={item.feedId}>
                                  <img
                                    className="w-full h-[180px] rounded-[28px] object-cover border hover:drop-shadow-lg transition-all delay-100"
                                    src={
                                      item.images[0]
                                        ? item.images[0].uploadFileURL
                                        : ''
                                    }
                                  />
                                </Link>
                              ))}
                            </React.Fragment>
                          ))}
                        </GridContainerFeed>
                        <div ref={feedListInView.ref}></div>
                      </>
                    )}
                  </div>
                </div>
                {/* 산책 게시물 */}
                <div className={currentTab === 1 ? 'block' : 'hidden'}>
                  <div className="flex justify-center">
                    {!myData?.animalParents ? (
                      <NoticeOnlyOwner />
                    ) : (
                      <>
                        {isWalkFeedError ? (
                          <NoticeServerError />
                        ) : (
                          <>
                            {!walkFeedData?.pages[0]?.length ? (
                              <NoticeNotWrite />
                            ) : (
                              <div>
                                <GridContainerWalk>
                                  {walkFeedData?.pages.map((page, index) => (
                                    <React.Fragment key={index}>
                                      {page.map(item => (
                                        <Link
                                          to={`/walkmate/${item.walkMatePostId}`}
                                          key={item.walkMatePostId}>
                                          <WalkCard
                                            size="sm"
                                            time={changeDateFormat(item.time)}
                                            title={item.title}
                                            friends={item.maximum}
                                            location={item.location}
                                            isclosed={`${item.open}`}
                                            nickname={item.memberInfo.nickname}
                                            imageURL={item.memberInfo.imageURL}
                                            key={item.walkMatePostId}
                                          />
                                        </Link>
                                      ))}
                                    </React.Fragment>
                                  ))}
                                </GridContainerWalk>
                                <div ref={walkListInView.ref}></div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </ListBox>
          </Container>
          {isListShowed && (
            <FollowList
              setIsListShowed={setIsListShowed}
              follow={followingData}
              path={'user'}
            />
          )}
        </>
      )}
    </>
  );
}

Component.displayName = 'UserPage';
