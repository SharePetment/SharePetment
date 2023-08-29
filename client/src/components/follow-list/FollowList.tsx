import { useNavigate } from 'react-router';
import * as SC from './followList.styled.tsx';
import Button from '@/common/button/Button.tsx';
import * as SCPOPUP from '@/common/popup/popup.styled.tsx';
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
      <SCPOPUP.PopupBackGround
        onClick={e => {
          e.preventDefault();
          handleCloseList();
        }}>
        <SC.FollowListContainer
          onClick={e => {
            e.stopPropagation();
          }}>
          <SC.Title>팔로잉</SC.Title>

          {Array.isArray(follow) && follow.length > 0 && (
            <SC.FollowBox>
              {follow?.map(
                ({ memberInfo: { nickname, imageURL, memberId } }) => (
                  <SC.FollowingBox
                    onClick={() => handleUserPage(memberId)}
                    key={memberId}>
                    <Profile isgreen="false" size="sm" url={imageURL} />
                    <SC.UserName> {nickname}</SC.UserName>
                  </SC.FollowingBox>
                ),
              )}
            </SC.FollowBox>
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
        </SC.FollowListContainer>
      </SCPOPUP.PopupBackGround>
    </>
  );
}
