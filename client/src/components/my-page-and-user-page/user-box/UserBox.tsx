import { ReactComponent as Setting } from '@/assets/button/setting.svg';
import Profile from '@/common/profile/Profile.tsx';
import * as SC from '@/components/my-page-and-user-page/user-box/userBox.styled';
import Subscribe from '@/components/subscribe/Subscribe.tsx';
import { Follow, UserInfo } from '@/types/userType';

type Prop = {
  userProfileImage?: string;
  data: UserInfo | undefined;
  followingData: Follow[] | undefined;
  handleUserEdit?: () => void;
  handleOpenFollowingList: () => void;
  type: 'myPage' | 'userPage';
  isSubscribed?: boolean;
  usersId?: string;
};

export default function UserBox({
  userProfileImage,
  data,
  followingData,
  handleUserEdit,
  handleOpenFollowingList,
  type,
  isSubscribed,
  usersId,
}: Prop) {
  return (
    <>
      {type === 'myPage' && (
        <SC.UserContainer>
          <div className="drop-shadow-lg">
            <Profile isgreen="true" size="lg" url={userProfileImage} />
          </div>
          <SC.UserNameBox>
            <SC.UserName>{data?.memberInfo.nickname}</SC.UserName>
            <button>
              <Setting onClick={handleUserEdit} />
            </button>
          </SC.UserNameBox>
          <SC.UserInfoBox>
            <div>
              <span>게시물 </span>
              <SC.HightliteText>{data?.feedCount || 0}</SC.HightliteText>
            </div>
            <div>
              <span>랜선집사 </span>
              <SC.HightliteText>{data?.followerCount || 0}</SC.HightliteText>
            </div>
            <div className="cursor-pointer" onClick={handleOpenFollowingList}>
              <span>구독 </span>
              <SC.HightliteText>{followingData?.length || 0}</SC.HightliteText>
            </div>
          </SC.UserInfoBox>
        </SC.UserContainer>
      )}
      {type === 'userPage' && (
        <SC.UserContainer>
          <Profile
            isgreen="true"
            size="lg"
            url={
              typeof data?.memberInfo === 'object'
                ? data?.memberInfo.imageURL
                : ''
            }
          />
          <SC.UserNameBox className="flex items-center gap-4">
            <SC.UserName>{data?.memberInfo.nickname}</SC.UserName>
            <Subscribe guestFollow={isSubscribed} usersId={usersId} />
          </SC.UserNameBox>
          <SC.UserInfoBox>
            <div>
              <span>게시물 </span>
              <SC.HightliteText>{data?.feedCount || 0}</SC.HightliteText>
            </div>
            <div>
              <span>랜선집사</span>
              <SC.HightliteText> {data?.followerCount || 0}</SC.HightliteText>
            </div>
            <div className="cursor-pointer" onClick={handleOpenFollowingList}>
              <span>구독 </span>
              <SC.HightliteText>{followingData?.length || 0}</SC.HightliteText>
            </div>
          </SC.UserInfoBox>
        </SC.UserContainer>
      )}
    </>
  );
}
