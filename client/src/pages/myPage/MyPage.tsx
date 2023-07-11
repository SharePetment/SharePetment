import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useReadLocalStorage } from 'usehooks-ts';
import { getServerData, getUserInfo } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import { ReactComponent as Setting } from '../../assets/button/setting.svg';
import Profile from '../../common/profile/Profile';
import FollowList from '../../components/follow-list/FollowList';
import PlusBtn from '../../components/plus-button/PlusBtn';
import PetContainer from '../../components/user_my_page/pet-container/PetContainer';
import { Feed } from '../../types/feedTypes';
import { Follow, UserInfo } from '../../types/userType';
import {
  Container,
  HightliteText,
  ListBox,
  PetBox,
  UserBox,
  UserInfoBox,
  UserName,
  UserNameBox,
} from './myPage.styled';

export function Component() {
  // userList 보여주기
  const [isListShowed, setIsListShowed] = useState(false);

  // 마이 info 데이터 불러오기

  const memberId = useReadLocalStorage<string>('memberId');

  // 유저 정보 조회
  const { data, isLoading } = useQuery<UserInfo>({
    queryKey: ['myPage', memberId],
    queryFn: () => getUserInfo(memberId, memberId),
  });

  // 내가 작성한 랜선집사 리스트 가져오기
  const { data: feedData, isLoading: feedLoading } = useQuery<Feed[]>({
    queryKey: ['myFeed', memberId],
    queryFn: () => getServerData(`${SERVER_URL}feeds/my-feed/${memberId}`),
  });

  // 팔로잉 회원 리스트 조회
  const { data: followingData, isLoading: followingLoading } = useQuery<
    Follow[]
  >({
    queryKey: ['followList', memberId],
    queryFn: () =>
      getServerData(`${SERVER_URL}members/following/list/${memberId}`),
  });
  // 유저이미지
  const [userProfileImage, setUserProfileImage] = useState(
    typeof data?.memberInfo === 'object' ? data?.memberInfo.imageUrl : '',
  );
  // navigate
  const navigate = useNavigate();

  // 유저 정보 수정 페이지로 이동
  const handleUserEdit = () => {
    navigate(`/info/${memberId}`, {
      state: {
        name: data?.name,
        nickname: data?.memberInfo.nickname,
        email: data?.email,
        address: data?.address,
      },
    });
  };

  // 유저 이미지와 일치하는 펫 이미지가 있는지 index를 통해 탐색
  let indexNumber;
  if (typeof data?.memberInfo === 'object') {
    const userImage = data?.memberInfo.imageUrl;
    const petArray = data?.pets.map(({ images }) => images.uploadFileUrl);
    indexNumber = petArray?.indexOf(userImage);
  }

  // 펫 check 여부 확인하기
  const [isPetCheck, setIsPetCheck] = useState(indexNumber);
  console.log(indexNumber);

  // 로딩 화면 보여주기
  if (!(!isLoading && !feedLoading && !followingLoading)) {
    return <div>Loading</div>;
  }
  // 팔로잉 리스트 보여주기
  const handleOpenFollowingList = () => {
    setIsListShowed(true);
  };

  return (
    <>
      <Container>
        <UserBox>
          <Profile isgreen="true" size="lg" url={userProfileImage} />
          <UserNameBox className="flex items-center gap-4">
            <UserName>안녕</UserName>
            <button>
              <Setting onClick={handleUserEdit} />
            </button>
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
                ({
                  images: { uploadFileUrl },
                  name,
                  information,
                  petId,
                  sex,
                  age,
                }) => (
                  <>
                    <PetContainer
                      name={name}
                      information={information}
                      petId={petId}
                      memberId={memberId as string}
                      sex={sex}
                      age={age}
                      uploadFileUrl={uploadFileUrl}
                      isPetCheck={isPetCheck}
                      setIsPetCheck={setIsPetCheck}
                      setUserProfileImage={setUserProfileImage}
                    />
                  </>
                ),
              )}
            </>
          )}
          <PlusBtn />
        </PetBox>
        <ListBox></ListBox>
      </Container>
      {isListShowed && (
        <FollowList setIsListShowed={setIsListShowed} follow={followingData} />
      )}
    </>
  );
}

Component.displayName = 'MyPage';
