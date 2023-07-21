import { useNavigate } from 'react-router';
import Button from '../../common/button/Button.tsx';
import { PopupBackGround } from '../../common/popup/popup.styled.tsx';
import Profile from '../../common/profile/Profile.tsx';
import { Follow } from '../../types/userType.ts';
import {
  FollowBox,
  FollowListContainer,
  FollowingBox,
  Title,
  UserName,
} from './followList.styled.tsx';

interface Prop {
  setIsListShowed: React.Dispatch<React.SetStateAction<boolean>>;
  follow: Follow[] | undefined;
  path?: string;
}

export default function FollowList({ setIsListShowed, follow, path }: Prop) {
  const navigate = useNavigate();
  const handleUserPage = (followerId: number) => {
    setIsListShowed(false);
    navigate(`/users/${followerId}`);
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
            (Array.isArray(follow) &&
              follow.length === 0 &&
              path === undefined)) && (
            <Button
              isgreen="true"
              text="구독을 먼저 해주세요!"
              size="lg"
              handler={handleCloseList}
            />
          )}
          {(!Array.isArray(follow) ||
            (Array.isArray(follow) && follow.length === 0 && !!path)) && (
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
