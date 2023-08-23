import { useNavigate } from 'react-router-dom';
import * as SC from './DesktopContainer.styled';
import { ReactComponent as Close } from '@/assets/button/close.svg';
import Comment from '@/common/comment/Comment';
import FeedInput from '@/common/input/feedInput/FeedInput';
import FeedCard from '@/components/card/feed-card/FeedCard';
import SideNav from '@/components/card/sidenav/SideNav';
import Toast from '@/components/toast/Toast';
import { State } from '@/store/Context';
import { Feed } from '@/types/feedTypes';

interface DesktopContainer {
  isToastOpen: boolean;
  data: Feed;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<[boolean, string]>>;
  setIsToastOpen: React.Dispatch<React.SetStateAction<boolean>>;
  state: State | null;
}

export default function DesktopContainer({
  isToastOpen,
  data,
  setIsDeleteOpen,
  setIsOpen,
  setIsToastOpen,
  state,
}: DesktopContainer) {
  const navigate = useNavigate();

  return (
    <SC.Container
      onClick={e => {
        if (e.target === e.currentTarget) navigate(-1);
      }}>
      {isToastOpen && (
        <SC.ToastWrap>
          <Toast />
        </SC.ToastWrap>
      )}
      <SC.CloseBtn onClick={() => navigate(-1)}>
        <Close fill="white" />
      </SC.CloseBtn>
      <SC.FeedContainer>
        <FeedCard
          memberid={data.memberInfo.memberId}
          username={data.memberInfo.nickname}
          context={data.content}
          userimg={data.memberInfo.imageURL}
          images={data.images}
        />
        <SC.RightBox>
          <SC.CommentBox>
            {data.feedComments !== null &&
              Array.isArray(data.feedComments) &&
              data.feedComments.map(comment => (
                <Comment
                  key={comment.feedCommentsId}
                  content={comment.content}
                  createdAt={comment.createdAt}
                  modifiedAt={comment.modifiedAt}
                  memberInfo={comment.memberInfo}
                  feedPostId={data.feedId}
                  feedCommentsId={comment.feedCommentsId}
                  type="feed"
                />
              ))}
          </SC.CommentBox>
          <SideNav
            feedid={data.feedId}
            direction="row"
            likes={data.likes}
            like={data.isLike ? 'true' : 'false'}
            deletehandler={setIsDeleteOpen}
            inperson={
              Number(state?.memberId) === data.memberInfo.memberId
                ? 'true'
                : 'false'
            }
            modalhandler={setIsOpen}
            toasthandler={setIsToastOpen}
          />
          <FeedInput feedid={data.feedId} blankhandler={setIsOpen} />
        </SC.RightBox>
      </SC.FeedContainer>
    </SC.Container>
  );
}
