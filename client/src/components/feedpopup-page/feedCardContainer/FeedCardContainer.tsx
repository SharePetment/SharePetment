import { useNavigate } from 'react-router-dom';
import FeedCard from '../../card/feed-card/FeedCard';
import SideNav from '../../card/sidenav/SideNav';
import Toast from '../../toast/Toast';
import * as SC from './FeedCardContainer.styled';
import { ReactComponent as Close } from '@/assets/button/close.svg';
import { State } from '@/store/Context';
import { Feed } from '@/types/feedTypes';

interface FeedCardContainerProp {
  data: Feed;
  isToastOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCommentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<[boolean, string]>>;
  setIsToastOpen: React.Dispatch<React.SetStateAction<boolean>>;
  state: State | null;
}

export default function FeedCardContainer({
  data,
  isToastOpen,
  setIsDeleteOpen,
  setIsCommentOpen,
  setIsOpen,
  setIsToastOpen,
  state,
}: FeedCardContainerProp) {
  const navigate = useNavigate();

  return (
    <SC.Container
      onClick={e => {
        if (e.target === e.currentTarget) navigate(-1);
      }}>
      {isToastOpen && (
        <div className="fixed right-3 bottom-4 z-50">
          <Toast />
        </div>
      )}
      <SC.CloseBtn onClick={() => navigate(-1)}>
        <Close fill="white" />
      </SC.CloseBtn>
      <FeedCard
        memberid={data.memberInfo.memberId}
        username={data.memberInfo.nickname}
        context={data.content}
        userimg={data.memberInfo.imageURL}
        images={data.images}
      />
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
        commenthandler={setIsCommentOpen}
        modalhandler={setIsOpen}
        toasthandler={setIsToastOpen}
      />
    </SC.Container>
  );
}
