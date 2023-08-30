import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { useReadLocalStorage } from 'usehooks-ts';
import {
  getServerDataWithJwt,
  getServerDataWithJwtScroll,
} from '@/api/queryfn.ts';
import { SERVER_URL } from '@/api/url.ts';
import FollowList from '@/components/follow-list/FollowList.tsx';
import LoadingComponent from '@/components/loading/LoadingComponent.tsx';
import PetContainerList from '@/components/my-page-and-user-page/pet-container-list/PetContainerList';
import Tab from '@/components/my-page-and-user-page/tab/Tab';
import TabDetail from '@/components/my-page-and-user-page/tab-detail/TabDetail';
import UserBox from '@/components/my-page-and-user-page/user-box/UserBox';
import NoticeServerError from '@/components/notice/NoticeServerError.tsx';
import useGetQuery from '@/hook/api/query/useGetQuery';
import UseInfinityScroll from '@/hook/api/query/useInfinityScroll';
import useMypageQuery from '@/hook/api/query/useMypageQuery';
import * as SC from '@/pages/myPage/myPage.styled.tsx';
import Path from '@/routers/paths.ts';
import { MemberIdContext } from '@/store/Context.tsx';
import { CommentProp } from '@/types/commentType';
import { Feed } from '@/types/feedTypes.ts';
import { Follow } from '@/types/userType';
import { WalkFeed } from '@/types/walkType.ts';

export function Component() {
  // navigate
  const navigate = useNavigate();

  // userList 보여주기
  const [isListShowed, setIsListShowed] = useState<boolean>(false);
  // 유저이미지 state
  const [userProfileImage, setUserProfileImage] = useState('');

  // active 탭 state
  const [currentTab, setCurrentTab] = useState(0);

  // 마이 info 데이터 불러오기
  const state = useContext(MemberIdContext);

  const accessToken = useReadLocalStorage<string | null>('accessToken');

  // 자신의 유저 정보 조회
  const {
    data,
    isLoading,
    isError: isUserError,
  } = useMypageQuery({
    url: `${SERVER_URL}/members`,
    accessToken,
    successFn: setUserProfileImage,
    parameter: 'image',
  });

  // 팔로잉 회원 리스트 조회
  const { data: followingData, isLoading: followingLoading } = useGetQuery<
    Follow[]
  >({
    key: ['followList'],
    url: `${SERVER_URL}/members/following/list`,
    accessToken,
  });

  // 자신이 작성한 댓글 리스트 조회
  const { data: commentListData, isError: commentError } = useGetQuery<
    CommentProp[]
  >({
    key: ['commentList'],
    url: `${SERVER_URL}/walkmates/comments/bymember`,
    accessToken,
  });

  /* ---------------------------- useInfiniteQuery ---------------------------- */
  // 자신이 작성한 피드리스트 조회
  const {
    data: feedData,
    isLoading: feedLoading,
    fetchNextPage: feedFetchNextPage,
    isError: isFeedError,
    ref: feedRef,
    inView: feedInview,
  } = UseInfinityScroll<Feed>({
    queryKey: `myFeed`,
    fn: getServerDataWithJwtScroll,
    enabledValue: accessToken,
  });

  /* ---------------------------- useInfiniteQuery ---------------------------- */
  // 자신이 작성한 산책 게시물 조회
  const {
    data: walkFeedData,
    isLoading: walkFeedLoading,
    fetchNextPage: walkFetchNextPage,
    isError: walkFeedError,
    ref: walkRef,
    inView: walkInview,
  } = UseInfinityScroll<WalkFeed>({
    queryKey: `walkFeedList`,
    fn: getServerDataWithJwt,
    enabledValue: accessToken,
  });

  useEffect(() => {
    if (walkInview) {
      walkFetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walkInview]);

  useEffect(() => {
    if (feedInview) {
      feedFetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedInview]);

  // 유저 정보 수정 페이지로 이동
  const handleUserEdit = () => {
    navigate(`${Path.Info}/${state?.memberId}`, {
      state: {
        name: data?.name,
        nickname: data?.memberInfo.nickname,
        email: data?.email,
        address: data?.address,
      },
    });
  };

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

  // 로딩화면

  if (isLoading || feedLoading || followingLoading || walkFeedLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <SC.Container>
        {/* 유저정보 */}
        <UserBox
          userProfileImage={userProfileImage}
          data={data}
          followingData={followingData}
          handleOpenFollowingList={handleOpenFollowingList}
          type={'myPage'}
          handleUserEdit={handleUserEdit}
        />

        {/* 펫 정보 */}
        <PetContainerList type="myPage" data={data} />

        {/* Tab */}

        <SC.ListBox>
          <Tab
            type="myPage"
            setCurrentTab={setCurrentTab}
            currentTab={currentTab}
          />
          {/* Tab Detail */}
          <div>
            <div className={currentTab === 0 ? 'block' : 'hidden'}>
              <TabDetail
                feedData={feedData}
                type="feed"
                ref={feedRef}
                isError={isFeedError}
              />
            </div>
            <div className={currentTab === 1 ? 'block' : 'hidden'}>
              <TabDetail
                walkData={walkFeedData}
                type="walkFeed"
                ref={walkRef}
                isError={walkFeedError}
                isPet={data?.animalParents}
              />
            </div>
            <ul
              className={
                currentTab === 2 ? 'flex flex-col items-center' : 'hidden'
              }>
              <TabDetail
                commentData={commentListData}
                type="comment"
                isError={commentError}
                isPet={data?.animalParents}
              />
            </ul>
          </div>
        </SC.ListBox>
      </SC.Container>
      {isListShowed && (
        <FollowList setIsListShowed={setIsListShowed} follow={followingData} />
      )}
    </>
  );
}

Component.displayName = 'MyPage';
