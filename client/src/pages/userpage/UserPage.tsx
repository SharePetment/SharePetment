import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerDataWithJwt } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import Profile from '../../common/profile/Profile';
import FollowList from '../../components/follow-list/FollowList';
import LoadingComponent from '../../components/loading/LoadingComponent';
import Subscribe from '../../components/subscribe/Subscribe';
import PetInfoBox from '../../components/user_my_page/petinfo-box/PetInfoBox';
import { Feed } from '../../types/feedTypes';
import { Follow, UserInfo } from '../../types/userType';
import {
  Container,
  HightliteText,
  PetBox,
  UserBox,
  UserInfoBox,
  UserName,
  UserNameBox,
} from './userPage.styled';

export function Component() {
  const { usersId } = useParams();
  const memberId = useReadLocalStorage<string>('memberId');
  const accessToken = useReadLocalStorage<string>('accessToken');

  // userList 보여주기 & 팔로일 리스트 보여주기
  const [isListShowed, setIsListShowed] = useState(false);
  const handleOpenFollowingList = () => {
    setIsListShowed(true);
  };

  // 유저 데이터 가지고 오기ㅣ
  const { data, isLoading } = useQuery<UserInfo>({
    queryKey: ['userPage', memberId, usersId],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/members/${usersId}/${memberId}`,
        accessToken as string,
      ),
    onSuccess(data) {
      setIsSubscribed(data.guestFollow);
    },
    onError(err) {
      console.log(err);
    },
  });
  // 구독 controller
  const [isSubscribed, setIsSubscribed] = useState(false);

  // 유저가 작성한 랜선집사 리스트 가져오기
  const { data: feedData, isLoading: feedLoading } = useQuery<Feed[]>({
    queryKey: ['userFeed', usersId],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/feeds/my-feed/${usersId}`,
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
  if (usersId === memberId) {
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
                <Subscribe
                  guestFollow={isSubscribed}
                  usersId={usersId}
                  memberId={memberId}
                />
              </UserNameBox>
              <UserInfoBox>
                <div>
                  <span>게시물 </span>
                  <HightliteText>{feedData?.length || 0}</HightliteText>
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

Component.displayName = 'UserPage';
