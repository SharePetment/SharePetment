import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { deleteFeed } from '../../api/mutationfn';
import { getServerDataWithJwt } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import { ReactComponent as Close } from '../../assets/button/close.svg';
import FeedComment from '../../common/comment/feedComment.tsx/FeedComment';
import FeedInput from '../../common/input/feedInput/FeedInput';
import Popup from '../../common/popup/Popup';
import FeedCard from '../../components/card/feedcard/FeedCard';
import SideNav from '../../components/card/sidenav/SideNav';
import LoadingComponent from '../../components/loading/LoadingComponent';
import Toast from '../../components/toast/Toast';
import { MemberIdContext } from '../../store/Context';
import { Feed } from '../../types/feedTypes';
import {
  Container,
  CloseBtn,
  FeedContainer,
  RightBox,
  CommentBox,
} from './FeedPopUp.styled';

export function Component() {
  const accessToken = useReadLocalStorage('accessToken');
  const memberId = useContext(MemberIdContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { feedId } = useParams();
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  console.log(memberId);
  // 피드 게시물 정보 가져오기
  const { data, isSuccess, isLoading } = useQuery<Feed>({
    queryKey: ['feedPopUp', Number(feedId)],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/feeds/${feedId}`,
        accessToken as string,
      ),
  });

  console.log(data);

  const deleteFeedMutation = useMutation({
    mutationFn: deleteFeed,
    onSuccess: data => {
      console.log(data);
      navigate(-1);
      queryClient.invalidateQueries({ queryKey: ['guestFeed'] });
    },
    // enabled: !!(Number(memberId) === data?.memberInfo.memberId),
  });

  const handlerDelete = () => {
    if (data) {
      const body = {
        url: `${SERVER_URL}/feeds/${data.feedId}`,
        token: accessToken as string,
      };
      deleteFeedMutation.mutate(body);
    }
  };

  // ESC 버튼 누를 시, 이전페이지로 이동
  useEffect(() => {
    const getBackPage = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', getBackPage);
    return () => window.removeEventListener('keydown', getBackPage);
  }, [navigate]);

  if (isLoading) return <LoadingComponent />;
  if (isSuccess)
    return (
      <>
        {isDeleteOpen && (
          <Popup
            title="피드를 삭제할까요?"
            isgreen={['true']}
            btnsize={['md', 'md']}
            buttontext={['삭제할래요', '아니요']}
            countbtn={2}
            handler={[handlerDelete, () => setIsDeleteOpen(false)]}
            popupcontrol={() => {
              setIsDeleteOpen(false);
            }}
          />
        )}
        <Container
          onClick={e => {
            if (e.target === e.currentTarget) navigate(-1);
          }}>
          {isToastOpen && (
            <div className="fixed right-8 bottom-8">
              <Toast />
            </div>
          )}
          <CloseBtn onClick={() => navigate(-1)}>
            <Close fill="white" />
          </CloseBtn>
          <FeedContainer>
            <FeedCard
              memberid={data.memberInfo.memberId}
              username={data.memberInfo.nickname}
              context={data.content}
              userimg={data.memberInfo.imageURL}
              images={data.images}
            />

            <RightBox>
              <CommentBox>
                {data.feedComments !== null &&
                  Array.isArray(data.feedComments) &&
                  data.feedComments.map(comment => (
                    <FeedComment
                      key={comment.feedCommentsId}
                      memberid={comment.memberInfo.memberId}
                      nickname={comment.memberInfo.nickname}
                      userimg={comment.memberInfo.imageURL}
                      content={comment.content}
                    />
                  ))}
              </CommentBox>
              <SideNav
                feedid={data.feedId}
                direction="row"
                likes={data.likes}
                like={data.isLike ? 'true' : 'false'}
                url={data.shareURL}
                toasthandler={setIsToastOpen}
                deletehandler={setIsDeleteOpen}
                inperson={
                  Number(memberId) === data.memberInfo.memberId
                    ? 'true'
                    : 'false'
                }
              />
              <FeedInput feedid={data.feedId} />
            </RightBox>
          </FeedContainer>
        </Container>
      </>
    );
}

Component.displayName = 'FeedPopUp';
