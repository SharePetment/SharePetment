import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React, { useState, useContext, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import { ReactComponent as FeedIcon } from '../../assets/feed.svg';
import { ReactComponent as WalkFeedIcon } from '../../assets/walk-feed.svg';
import Profile from '../../common/profile/Profile';
import WalkCard from '../../components/card/walk-card/walkCard';
import FollowList from '../../components/follow-list/FollowList';
import LoadingComponent from '../../components/loading/LoadingComponent';
import NoticeNotWrite from '../../components/notice/NoticeNotWrite';
import NoticeOnlyOwner from '../../components/notice/NoticeOnlyOwner';
import NoticeServerError from '../../components/notice/NoticeServerError';
import Subscribe from '../../components/subscribe/Subscribe';
import PetInfoBox from '../../components/user_my_page/petinfo-box/PetInfoBox';
import { MemberIdContext } from '../../store/Context';
import { Feed } from '../../types/feedTypes';
import { Follow, UserInfo } from '../../types/userType';
import { WalkFeed } from '../../types/walkType';
import { changeDateFormat } from '../../util/changeDateFormat';
import {
  GridContainerFeed,
  GridContainerWalk,
  TabMenu,
  TabMenuList,
} from '../myPage/myPage.styled';
import {
  Container,
  HightliteText,
  ListBox,
  PetBox,
  UserBox,
  UserInfoBox,
  UserName,
  UserNameBox,
} from './userPage.styled';

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
  const { data, isLoading } = useQuery<UserInfo>({
    queryKey: ['userPage', usersId],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/members/${usersId}`,
        accessToken as string,
      ),
    onSuccess(data) {
      setIsSubscribed(data.guestFollow);
    },
    onError(err) {
      console.log(err);
    },
  });

  // (본인) 유저 데이터 가지고 오기
  const { data: myData } = useQuery<UserInfo>({
    queryKey: ['myPage'],
    queryFn: () =>
      getServerDataWithJwt(`${SERVER_URL}/members`, accessToken as string),
  });

  // 유저가 작성한 피드 리스트 가져오기
  const {
    data: feedData,
    isLoading: feedLoading,
    isError: walkFeedError,
  } = useQuery<{
    responseList: Feed[];
  }>({
    queryKey: ['userFeed', usersId],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/feeds/other-feed/${usersId}`,
        accessToken as string,
      ),
  });

  /* ---------------------------- useInfiniteQuery ---------------------------- */
  // 유저가 작성한 산책 리스트 가져오기
  const { ref, inView } = useInView();
  const { data: walkFeedData, fetchNextPage } = useInfiniteQuery<WalkFeed[]>({
    queryKey: ['UserwalkFeedList'],
    queryFn: ({ pageParam = 0 }) => {
      return getServerDataWithJwt(
        `${SERVER_URL}/walkmates/other-walks/${usersId}?openFilter=false&&page=${pageParam}&size=10`,
        accessToken as string,
      );
    },

    getNextPageParam: (lastPage, allPages) => {
      console.log(lastPage, allPages);
      const len = allPages.length;
      const totalLength = allPages.length;
      return allPages[totalLength - 1].length === 0 ? undefined : len;
    },
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

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
                  <HightliteText>
                    {feedData?.responseList?.length || 0}
                  </HightliteText>
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
                    className={currentTab === 0 ? `fill-deepgreen ` : undefined}
                  />
                </TabMenuList>
                <TabMenuList
                  onClick={() => setCurrentTab(1)}
                  className={
                    currentTab === 1 ? `border-t-2 border-t-[green]` : undefined
                  }>
                  <WalkFeedIcon
                    className={currentTab === 1 ? `fill-deepgreen ` : undefined}
                  />
                </TabMenuList>
              </TabMenu>
              <div>
                {/* 피드 */}
                <div className={currentTab === 0 ? 'block' : 'hidden'}>
                  <div>
                    {!feedData?.responseList.length ? (
                      <>
                        {walkFeedError ? (
                          <NoticeServerError />
                        ) : (
                          <NoticeNotWrite />
                        )}
                      </>
                    ) : (
                      <GridContainerFeed>
                        {feedData?.responseList?.map(item => (
                          <Link
                            to={`/home/${item.feedId}`}
                            key={item.feedId}
                            className=" cursor-pointer">
                            <img
                              className="w-full h-[180px] rounded-[28px] object-cover"
                              src={item.images[0].uploadFileURL}
                            />
                          </Link>
                        ))}
                      </GridContainerFeed>
                    )}
                  </div>
                </div>
                {/* 산책 게시물 */}
                <div className={currentTab === 1 ? 'block' : 'hidden'}>
                  <div>
                    {!myData?.animalParents ? (
                      <NoticeOnlyOwner />
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
                            <div ref={ref}></div>
                          </div>
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
