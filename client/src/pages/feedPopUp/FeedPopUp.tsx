import { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { SERVER_URL } from '@/api/url.ts';
import { ReactComponent as Close } from '@/assets/button/close.svg';
import Comment from '@/common/comment/Comment';
import FeedInput from '@/common/input/feedInput/FeedInput';
import AlertText from '@/common/popup/AlertText';
import Popup from '@/common/popup/Popup';
import FeedCard from '@/components/card/feed-card/FeedCard';
import SideNav from '@/components/card/sidenav/SideNav';
import LoadingComponent from '@/components/loading/LoadingComponent';
import NoticeServerError from '@/components/notice/NoticeServerError';
import Toast from '@/components/toast/Toast';
import useDeleteMutation from '@/hook/api/mutation/useDeleteMutation';
import useGuestFeedQuery from '@/hook/api/query/useGuestFeedQuery';
import useHostFeedQuery from '@/hook/api/query/useHostFeedQuery';
import useHandleKeyBoard from '@/hook/useHandleKeyBoard';
import {
  Container,
  CloseBtn,
  FeedContainer,
  RightBox,
  CommentBox,
  FeedCardContainer,
  CommentContainer,
} from '@/pages/feedPopUp/FeedPopUp.styled';
import Path from '@/routers/paths.ts';
import { MemberIdContext } from '@/store/Context';
import { Feed } from '@/types/feedTypes';

export function Component() {
  const accessToken = useReadLocalStorage<string | null>('accessToken');
  const state = useContext(MemberIdContext);
  const navigate = useNavigate();
  const { feedId } = useParams();

  // 알림 토스트 및 팝업창 state
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<[boolean, string]>([false, '']);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isCommentOpen, setIsCommentOpen] = useState<boolean>(false);

  // 피드 게시물 정보 가져오기
  const { data, isSuccess, isLoading, isError } = useHostFeedQuery({
    key: ['feedPopUp', Number(feedId)],
    url: `${SERVER_URL}/feeds/${feedId}`,
    accessToken,
    state,
  });

  const getGuestFeed = useGuestFeedQuery<Feed>({
    key: ['guestFeedPopUp', Number(feedId)],
    url: `${SERVER_URL}/feeds/all/${feedId}`,
    accessToken,
  });

  const deleteFeedMutation = useDeleteMutation({
    keys: [['guestFeed']],
    successFn: () => navigate(Path.MyPage),
    errorFn: () => setIsOpen([true, AlertText.Failed]),
  });

  const handlerDelete = () => {
    if (data) {
      const body = {
        url: `${SERVER_URL}/feeds/${data.feedId}`,
        accessToken,
      };
      deleteFeedMutation.mutate(body);
    }
  };

  // ESC 버튼 누를 시, 이전페이지로 이동
  useHandleKeyBoard({ navigate });

  if (isLoading && getGuestFeed.isLoading) return <LoadingComponent />;
  if (isError || getGuestFeed.isError)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <NoticeServerError />
      </div>
    );
  if (isSuccess)
    return (
      <>
        {isOpen[0] && (
          <Popup
            title={isOpen[1]}
            handler={[() => setIsOpen([false, ''])]}
            popupcontrol={() => setIsOpen([false, ''])}
          />
        )}
        {isDeleteOpen && (
          <Popup
            title={AlertText.Delete}
            countbtn={2}
            handler={[handlerDelete, () => setIsDeleteOpen(false)]}
            popupcontrol={() => {
              setIsDeleteOpen(false);
            }}
          />
        )}
        {window.innerWidth < 420 ? (
          <>
            {isCommentOpen && (
              <CommentContainer
                onClick={e => {
                  if (e.target === e.currentTarget) setIsCommentOpen(false);
                }}>
                <div className="bg-white w-[320px] h-[570px] rounded-3xl p-3">
                  <CommentBox
                    className={
                      window.innerHeight < 850 ? 'h-[31rem]' : 'h-[31rem]'
                    }>
                    {data.feedComments !== null &&
                      Array.isArray(data.feedComments) &&
                      data.feedComments.map(comment => (
                        <>
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
                        </>
                      ))}
                  </CommentBox>
                  <FeedInput feedid={data.feedId} blankhandler={setIsOpen} />
                </div>
              </CommentContainer>
            )}
            <FeedCardContainer
              onClick={e => {
                if (e.target === e.currentTarget) navigate(-1);
              }}>
              {isToastOpen && (
                <div className="fixed right-3 bottom-4 z-50">
                  <Toast />
                </div>
              )}
              <CloseBtn onClick={() => navigate(-1)}>
                <Close fill="white" />
              </CloseBtn>
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
            </FeedCardContainer>
          </>
        ) : (
          <Container
            onClick={e => {
              if (e.target === e.currentTarget) navigate(-1);
            }}>
            {isToastOpen && (
              <div className="fixed right-8 bottom-10 z-50">
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
                </CommentBox>
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
              </RightBox>
            </FeedContainer>
          </Container>
        )}
      </>
    );

  if (getGuestFeed.isSuccess)
    return (
      <>
        {isOpen[0] && (
          <Popup
            title={isOpen[1]}
            handler={[() => setIsOpen([false, ''])]}
            popupcontrol={() => setIsOpen([false, ''])}
          />
        )}
        {isDeleteOpen && (
          <Popup
            title={AlertText.Delete}
            countbtn={2}
            handler={[handlerDelete, () => setIsDeleteOpen(false)]}
            popupcontrol={() => {
              setIsDeleteOpen(false);
            }}
          />
        )}
        {window.innerWidth < 420 ? (
          <>
            {isCommentOpen && (
              <CommentContainer
                onClick={e => {
                  if (e.target === e.currentTarget) setIsCommentOpen(false);
                }}>
                <div className="bg-white w-[320px] h-[570px] rounded-3xl p-3">
                  <CommentBox
                    className={
                      window.innerHeight < 850 ? 'h-[31rem]' : 'h-[31rem]'
                    }>
                    {getGuestFeed.data.feedComments !== null &&
                      Array.isArray(getGuestFeed.data.feedComments) &&
                      getGuestFeed.data.feedComments.map(comment => (
                        <Comment
                          key={comment.feedCommentsId}
                          content={comment.content}
                          createdAt={comment.createdAt}
                          modifiedAt={comment.modifiedAt}
                          memberInfo={comment.memberInfo}
                          feedPostId={getGuestFeed.data.feedId}
                          feedCommentsId={comment.feedCommentsId}
                          type="feed"
                        />
                      ))}
                  </CommentBox>
                </div>
              </CommentContainer>
            )}
            <FeedCardContainer
              onClick={e => {
                if (e.target === e.currentTarget) navigate(-1);
              }}>
              {isToastOpen && (
                <div className="fixed right-3 bottom-4 z-50">
                  <Toast />
                </div>
              )}
              <CloseBtn onClick={() => navigate(-1)}>
                <Close fill="white" />
              </CloseBtn>
              <FeedCard
                memberid={getGuestFeed.data.memberInfo.memberId}
                username={getGuestFeed.data.memberInfo.nickname}
                context={getGuestFeed.data.content}
                userimg={getGuestFeed.data.memberInfo.imageURL}
                images={getGuestFeed.data.images}
              />
              <SideNav
                feedid={getGuestFeed.data.feedId}
                direction="row"
                likes={getGuestFeed.data.likes}
                like={getGuestFeed.data.isLike ? 'true' : 'false'}
                deletehandler={setIsDeleteOpen}
                inperson={
                  Number(state?.memberId) ===
                  getGuestFeed.data.memberInfo.memberId
                    ? 'true'
                    : 'false'
                }
                commenthandler={setIsCommentOpen}
                modalhandler={setIsOpen}
                toasthandler={setIsToastOpen}
              />
            </FeedCardContainer>
          </>
        ) : (
          <Container
            onClick={e => {
              if (e.target === e.currentTarget) navigate(-1);
            }}>
            {isToastOpen && (
              <div className="fixed right-8 bottom-10 z-50">
                <Toast />
              </div>
            )}
            <CloseBtn onClick={() => navigate(-1)}>
              <Close fill="white" />
            </CloseBtn>
            <FeedContainer>
              <FeedCard
                memberid={getGuestFeed.data.memberInfo.memberId}
                username={getGuestFeed.data.memberInfo.nickname}
                context={getGuestFeed.data.content}
                userimg={getGuestFeed.data.memberInfo.imageURL}
                images={getGuestFeed.data.images}
              />
              <RightBox>
                <CommentBox>
                  {getGuestFeed.data.feedComments !== null &&
                    Array.isArray(getGuestFeed.data.feedComments) &&
                    getGuestFeed.data.feedComments.map(comment => (
                      <Comment
                        key={comment.feedCommentsId}
                        content={comment.content}
                        createdAt={comment.createdAt}
                        modifiedAt={comment.modifiedAt}
                        memberInfo={comment.memberInfo}
                        feedPostId={getGuestFeed.data.feedId}
                        feedCommentsId={comment.feedCommentsId}
                        type="feed"
                      />
                    ))}
                </CommentBox>
              </RightBox>
            </FeedContainer>
          </Container>
        )}
      </>
    );
}

Component.displayName = 'FeedPopUp';
