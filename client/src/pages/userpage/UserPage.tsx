import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerData, getUserInfo } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import Profile from '../../common/profile/Profile';
import FollowList from '../../components/follow-list/FollowList';
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

  // userList 보여주기 & 팔로일 리스트 보여주기
  const [isListShowed, setIsListShowed] = useState(false);
  const handleOpenFollowingList = () => {
    setIsListShowed(true);
  };

  // 유저 데이터 가지고 오기ㅣ
  const { data } = useQuery<UserInfo>({
    queryKey: ['userPage', memberId, usersId],
    queryFn: () => getUserInfo(usersId, memberId),
    onError(err) {
      console.dir(err);
    },
  });
  // 구독 controller
  const [isSubscribed, setIsSubscribed] = useState(data?.guestFollow);

  // 유저가 작성한 랜선집사 리스트 가져오기
  const { data: feedData } = useQuery<Feed[]>({
    queryKey: ['userFeed', usersId],
    queryFn: () => getServerData(`${SERVER_URL}feeds/my-feed/${usersId}`),
  });

  // 팔로잉 회원 리스트 조회
  const { data: followingData } = useQuery<Follow[]>({
    queryKey: ['followList', usersId],
    queryFn: () =>
      getServerData(`${SERVER_URL}members/following/list/${usersId}`),
  });

  // 로딩 보여주기
  /*   if (!(!isLoading && !feedLoading && !followingLoading)) {
    return <div>Loading</div>;
  }
 */
  return (
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
            <UserName>안녕</UserName>
            <Subscribe
              guestFollow={isSubscribed}
              usersId={usersId}
              memberId={memberId}
              setIsSubscribed={setIsSubscribed}
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
            <div className="cursor-pointer" onClick={handleOpenFollowingList}>
              <span>구독 </span>
              <HightliteText>{followingData?.length || 0}</HightliteText>
            </div>
          </UserInfoBox>
        </UserBox>
        <PetBox>
          {Array.isArray(data?.pets) && (
            <>
              {data?.pets.map(
                ({ images: { uploadFileUrl }, name, information, sex }) => (
                  <PetInfoBox
                    name={name}
                    information={information}
                    sex={sex}
                    uploadFileUrl={uploadFileUrl}
                  />
                ),
              )}
            </>
          )}
        </PetBox>
      </Container>
      {isListShowed && (
        <FollowList setIsListShowed={setIsListShowed} follow={followingData} />
      )}
    </>
  );
}

Component.displayName = 'UserPage';
