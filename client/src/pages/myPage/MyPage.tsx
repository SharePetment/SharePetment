import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../../api/queryfn.ts';
import { SERVER_URL } from '../../api/url.ts';
import { ReactComponent as Setting } from '../../assets/button/setting.svg';
import { ReactComponent as CommentListIcon } from '../../assets/comment-list.svg';
import { ReactComponent as FeedIcon } from '../../assets/feed.svg';
import NoCommentCat from '../../assets/illustration/nocomment-cat.png';
import { ReactComponent as WalkFeedIcon } from '../../assets/walk-feed.svg';
import Profile from '../../common/profile/Profile.tsx';
import WalkCard from '../../components/card/walk-card/walkCard.tsx';
import FollowList from '../../components/follow-list/FollowList.tsx';
import LoadingComponent from '../../components/loading/LoadingComponent.tsx';
import NoticeNoData from '../../components/notice/NoticeNoData.tsx';
import NoticeOnlyOwner from '../../components/notice/NoticeOnlyOwner.tsx';
import NoticeServerError from '../../components/notice/NoticeServerError.tsx';
import PlusBtn from '../../components/plus-button/PlusBtn.tsx';
import PetContainer from '../../components/user_my_page/pet-container/PetContainer.tsx';
import { MemberIdContext } from '../../store/Context.tsx';
import { CommentProp } from '../../types/commentType.ts';
import { Feed } from '../../types/feedTypes.ts';
import { Follow, UserInfo } from '../../types/userType.ts';
import { WalkFeed } from '../../types/walkType.ts';
import { changeDateFormat } from '../../util/changeDateFormat.ts';
import changeTime from '../../util/changeTime.ts';
import { ErrorText } from '../notFound/NotFound.styled.tsx';
import {
  Container,
  HightliteText,
  ListBox,
  PetBox,
  TabMenu,
  TabMenuList,
  UserBox,
  UserInfoBox,
  UserName,
  UserNameBox,
  GridContainerFeed,
  GridContainerWalk,
  CommentList,
} from './myPage.styled.tsx';

export function Component() {
  // navigate
  const navigate = useNavigate();

  // userList 보여주기
  const [isListShowed, setIsListShowed] = useState<boolean>(false);
  // 유저이미지 state
  const [userProfileImage, setUserProfileImage] = useState('');
  // 펫 check 여부
  const [isPetCheck, setIsPetCheck] = useState(-1);
  // active 탭 state
  const [currentTab, setCurrentTab] = useState(0);

  // 마이 info 데이터 불러오기
  const state = useContext(MemberIdContext);

  const accessToken = useReadLocalStorage<string>('accessToken');

  // 자신의 유저 정보 조회
  const {
    data,
    isLoading,

    isError: isUserError,
  } = useQuery<UserInfo>({
    queryKey: ['myPage'],
    queryFn: () =>
      getServerDataWithJwt(`${SERVER_URL}/members`, accessToken as string),
    onSuccess(data) {
      setUserProfileImage(data.memberInfo.imageURL);
    },
  });

  // 팔로잉 회원 리스트 조회
  const { data: followingData, isLoading: followingLoading } = useQuery<
    Follow[]
  >({
    queryKey: ['followList'],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/members/following/list`,
        accessToken as string,
      ),
  });

  // 자신이 작성한 댓글 리스트 조회
  const { data: commentListData, isError: commentError } = useQuery<
    CommentProp[]
  >({
    queryKey: ['commentList'],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/walkmates/comments/bymember`,
        accessToken as string,
      ),
  });

  /* ---------------------------- useInfiniteQuery ---------------------------- */
  // 자신이 작성한 피드리스트 조회
  const feedListInView = useInView();
  const {
    data: feedData,
    isLoading: feedLoading,
    fetchNextPage: feedFetchNextPage,
    isError: isFeedError,
  } = useInfiniteQuery<Feed[]>({
    queryKey: ['myFeed'],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getServerDataWithJwt(
        `${SERVER_URL}/feeds/my-feed?page=${pageParam}&size=10`,
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
  // 자신이 작성한 산책 게시물 조회
  const walkListInView = useInView();
  const {
    data: walkFeedData,
    isLoading: walkFeedLoading,
    fetchNextPage: walkFetchNextPage,
    isError: walkFeedError,
  } = useInfiniteQuery<WalkFeed[]>({
    queryKey: ['walkFeedList'],
    queryFn: ({ pageParam = 0 }) => {
      return getServerDataWithJwt(
        `${SERVER_URL}/walkmates/my-walks?openFilter=false&&page=${pageParam}&size=10`,
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

  // 유저 정보 수정 페이지로 이동
  const handleUserEdit = () => {
    navigate(`/info/${state?.memberId}`, {
      state: {
        name: data?.name,
        nickname: data?.memberInfo.nickname,
        email: data?.email,
        address: data?.address,
      },
    });
  };

  // 유저 이미지와 일치하는 펫 이미지가 있는지 index를 통해 탐색
  useEffect(() => {
    let indexNumber;
    if (typeof data?.memberInfo === 'object') {
      const userImage = data?.memberInfo.imageURL;
      const petArray = data?.pets.map(({ images }) => images.uploadFileURL);
      indexNumber = petArray?.indexOf(userImage);
      setIsPetCheck(indexNumber);
    }
  }, [data]);

  // 팔로잉 리스트 보여주기
  const handleOpenFollowingList = () => {
    setIsListShowed(true);
  };

  // 전체 오류 화면
  if (isUserError) {
    return (
      <div className="flex h-screen w-screen items-center justify-center ">
        <NoticeServerError />
      </div>
    );
  }

  return (
    <>
      {!(
        !isLoading &&
        !feedLoading &&
        !followingLoading &&
        !walkFeedLoading
      ) ? (
        <LoadingComponent />
      ) : (
        <>
          <Container>
            <UserBox>
              <div className="drop-shadow-lg">
                <Profile isgreen="true" size="lg" url={userProfileImage} />
              </div>
              <UserNameBox>
                <UserName>{data?.memberInfo.nickname}</UserName>
                <button>
                  <Setting onClick={handleUserEdit} />
                </button>
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
            <PetBox>
              {Array.isArray(data?.pets) && (
                <>
                  {data?.pets.map(
                    (
                      {
                        images: { uploadFileURL },
                        name,
                        information,
                        petId,
                        sex,
                        age,
                      },
                      index,
                    ) => (
                      <PetContainer
                        key={petId}
                        name={name}
                        information={information}
                        petId={petId}
                        sex={sex}
                        age={age}
                        uploadFileURL={uploadFileURL}
                        isPetCheck={isPetCheck}
                        setIsPetCheck={setIsPetCheck}
                        index={index}
                      />
                    ),
                  )}
                </>
              )}
              <PlusBtn />
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
                <TabMenuList
                  onClick={() => setCurrentTab(2)}
                  className={
                    currentTab === 2 ? `border-t-2 border-t-[green]` : undefined
                  }>
                  <CommentListIcon
                    stroke={currentTab === 2 ? `#69B783` : '#d4d4d8'}
                    className="cursor-pointer"
                  />
                </TabMenuList>
              </TabMenu>
              <div>
                <div className={currentTab === 0 ? 'block' : 'hidden'}>
                  <div>
                    {feedData?.pages[0].length === 0 ? (
                      <>
                        {isFeedError ? (
                          <NoticeServerError />
                        ) : (
                          <NoticeNoData url="feed-posting" />
                        )}
                      </>
                    ) : (
                      <>
                        <GridContainerFeed>
                          {feedData?.pages.map((page, index) => (
                            <React.Fragment key={index}>
                              {page.map(item => (
                                <Link
                                  to={`/home/${item.feedId}`}
                                  key={item.feedId}>
                                  <img
                                    className="w-full h-[180px] rounded-[28px] object-cover border hover:scale-105 transition-all delay-75"
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
                <div className={currentTab === 1 ? 'block' : 'hidden'}>
                  {!data?.animalParents ? (
                    <NoticeOnlyOwner />
                  ) : (
                    <>
                      {walkFeedError ? (
                        <NoticeServerError />
                      ) : (
                        <div className="flex justify-center">
                          {!walkFeedData?.pages[0]?.length ? (
                            <NoticeNoData url="walk-posting" />
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
                        </div>
                      )}
                    </>
                  )}
                </div>
                <ul
                  className={
                    currentTab === 2 ? 'flex flex-col items-center' : 'hidden'
                  }>
                  {!data?.animalParents ? (
                    <NoticeOnlyOwner />
                  ) : (
                    <>
                      {commentError ? (
                        <NoticeServerError />
                      ) : (
                        <div className="w-[300px]">
                          {!commentListData?.length ? (
                            <div className="flex flex-col items-center justify-center">
                              <ErrorText>
                                아직 댓글을 단 산책 게시물이 없어요.
                              </ErrorText>
                              <img src={NoCommentCat} className="w-80 mt-10" />
                            </div>
                          ) : (
                            commentListData?.map(item => (
                              <Link
                                to={`/walkmate/${item.walkMatePostId}`}
                                key={item.walkMateCommentId}>
                                <CommentList>
                                  <span className=" whitespace-nowrap overflow-hidden text-ellipsis ">
                                    {item.content}
                                  </span>
                                  <time className="text-deepgray text-xs flex-shrink-0">
                                    {changeTime(item.createdAt)}
                                  </time>
                                </CommentList>
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </>
                  )}
                </ul>
              </div>
            </ListBox>
          </Container>
          {isListShowed && (
            <FollowList
              setIsListShowed={setIsListShowed}
              follow={followingData}
            />
          )}
        </>
      )}
    </>
  );
}

Component.displayName = 'MyPage';
