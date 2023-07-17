import { useQuery } from '@tanstack/react-query';
import { useState, useContext } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import { ReactComponent as FeedIcon } from '../../assets/feed.svg';
import { ReactComponent as WalkFeedIcon } from '../../assets/walk-feed.svg';
import Profile from '../../common/profile/Profile';
import WalkCard from '../../components/card/walkcard/walkCard';
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

  // 유저가 작성한 산책 리스트 가져오기
  const { data: walkFeedData } = useQuery<WalkFeed[]>({
    queryKey: ['UserwalkFeedList', usersId],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/walkmates/other-walks/${usersId}?openFilter=false&page=0&size=10`,
        accessToken as string,
      ),
  });

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
                <div className={currentTab === 1 ? 'block' : 'hidden'}>
                  <div>
                    {!myData?.animalParents ? (
                      <NoticeOnlyOwner />
                    ) : (
                      <>
                        {!walkFeedData?.length ? (
                          <NoticeNotWrite />
                        ) : (
                          <GridContainerWalk>
                            {walkFeedData?.map(item => {
                              const { time, content, maximum, location, open } =
                                item;

                              return (
                                <Link
                                  to={`/walkmate/${item.walkMatePostId}`}
                                  key={item.walkMatePostId}>
                                  <WalkCard
                                    size="sm"
                                    time={time}
                                    title={content}
                                    friends={maximum}
                                    location={location}
                                    isclosed={`${open}`}
                                    nickname={item.memberInfo.nickname}
                                    imageURL={item.memberInfo.imageURL}
                                  />
                                </Link>
                              );
                            })}
                          </GridContainerWalk>
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
