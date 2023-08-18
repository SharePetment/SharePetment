import { useNavigate } from 'react-router';
import {
  FollowBox,
  FollowListContainer,
  FollowingBox,
  Title,
  UserName,
} from './followList.styled.tsx';
import Button from '@/common/button/Button.tsx';
import { PopupBackGround } from '@/common/popup/popup.styled.tsx';
import Profile from '@/common/profile/Profile.tsx';
import Path from '@/routers/paths.ts';
import { Follow } from '@/types/userType.ts';

interface Prop {
  setIsListShowed: React.Dispatch<React.SetStateAction<boolean>>;
  follow: Follow[] | undefined;
  path?: string;
}

export default function FollowList({ setIsListShowed, follow }: Prop) {
  const navigate = useNavigate();
  const handleUserPage = (followerId: number) => {
    setIsListShowed(false);
    navigate(`${Path.User}/${followerId}`);
  };
  const handleCloseList = () => {
    setIsListShowed(false);
  };
  return (
    <>
      <PopupBackGround
        onClick={e => {
          e.preventDefault();
          handleCloseList();
        }}>
        <FollowListContainer
          onClick={e => {
            e.stopPropagation();
          }}>
          <Title>팔로잉</Title>

          {Array.isArray(follow) && follow.length > 0 && (
            <FollowBox>
              {follow?.map(
                ({ memberInfo: { nickname, imageURL, memberId } }) => (
                  <FollowingBox
                    onClick={() => handleUserPage(memberId)}
                    key={memberId}>
                    <Profile isgreen="false" size="sm" url={imageURL} />
                    <UserName> {nickname}</UserName>
                  </FollowingBox>
                ),
              )}
            </FollowBox>
          )}

          {(!Array.isArray(follow) ||
            (Array.isArray(follow) && follow.length === 0)) && (
            <Button
              isgreen="true"
              text={'아직 구독한 유저가 없습니다. 😥'}
              size="lg"
              handler={handleCloseList}
            />
          )}
        </FollowListContainer>
      </PopupBackGround>
    </>
  );
}
