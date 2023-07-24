import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { deleteFeed } from '../../api/mutationfn.ts';
import { getServerData, getServerDataWithJwt } from '../../api/queryfn.ts';
import { SERVER_URL } from '../../api/url.ts';
import { ReactComponent as Close } from '../../assets/button/close.svg';
import FeedComment from '../../common/comment/feedComment/FeedComment';
import FeedInput from '../../common/input/feedInput/FeedInput';
import Popup from '../../common/popup/Popup';
import FeedCard from '../../components/card/feed-card/FeedCard';
import SideNav from '../../components/card/sidenav/SideNav';
import LoadingComponent from '../../components/loading/LoadingComponent';
import NoticeServerError from '../../components/notice/NoticeServerError';
import { MemberIdContext } from '../../store/Context';
import { Feed } from '../../types/feedTypes';
import changeTime from '../../util/changeTime';
import {
  Container,
  CloseBtn,
  FeedContainer,
  RightBox,
  CommentBox,
  FeedCardContainer,
  CommentContainer,
} from './FeedPopUp.styled';

export function Component() {
  const accessToken = useReadLocalStorage('accessToken');
  const state = useContext(MemberIdContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { feedId } = useParams();

  // 알림 토스트 및 팝업창 state
  const [isOpen, setIsOpen] = useState<[boolean, string]>([false, '']);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isCommentOpen, setIsCommentOpen] = useState<boolean>(false);

  // 피드 게시물 정보 가져오기
  const { data, isSuccess, isLoading, isError } = useQuery<Feed>({
    queryKey: ['feedPopUp', Number(feedId)],
    queryFn: () =>
      getServerDataWithJwt(
        `${SERVER_URL}/feeds/${feedId}`,
        accessToken as string,
      ),
    enabled: !!(state && accessToken),
  });

  const getGuestFeed = useQuery<Feed>({
    queryKey: ['guestFeedPopUp', Number(feedId)],
    queryFn: () => getServerData(`${SERVER_URL}/feeds/all/${feedId}`),
    enabled: !!(accessToken === null),
  });

  const deleteFeedMutation = useMutation({
    mutationFn: deleteFeed,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['guestFeed'] });
      navigate('/my-page');
    },
    onError: () => setIsOpen([true, '요청에 실패했어요.']),
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
            isgreen={['true']}
            btnsize={['md']}
            buttontext={['확인']}
            countbtn={1}
            handler={[() => setIsOpen([false, ''])]}
            popupcontrol={() => setIsOpen([false, ''])}
          />
        )}
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
                        <FeedComment
                          key={comment.feedCommentsId}
                          inperson={
                            comment.memberInfo.memberId ===
                            Number(state?.memberId)
                              ? 'true'
                              : 'false'
                          }
                          nickname={comment.memberInfo.nickname}
                          userimg={comment.memberInfo.imageURL}
                          content={comment.content}
                          commentid={comment.feedCommentsId}
                          feedid={data.feedId}
                          blankhandler={setIsOpen}
                          memberid={comment.memberInfo.memberId}
                          time={changeTime(comment.createdAt)}
                        />
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
              />
            </FeedCardContainer>
          </>
        ) : (
          <Container
            onClick={e => {
              if (e.target === e.currentTarget) navigate(-1);
            }}>
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
                        inperson={
                          comment.memberInfo.memberId ===
                          Number(state?.memberId)
                            ? 'true'
                            : 'false'
                        }
                        nickname={comment.memberInfo.nickname}
                        userimg={comment.memberInfo.imageURL}
                        content={comment.content}
                        commentid={comment.feedCommentsId}
                        feedid={data.feedId}
                        blankhandler={setIsOpen}
                        memberid={comment.memberInfo.memberId}
                        time={changeTime(comment.createdAt)}
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
            isgreen={['true']}
            btnsize={['md']}
            buttontext={['확인']}
            countbtn={1}
            handler={[() => setIsOpen([false, ''])]}
            popupcontrol={() => setIsOpen([false, ''])}
          />
        )}
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
                        <FeedComment
                          key={comment.feedCommentsId}
                          inperson={
                            comment.memberInfo.memberId ===
                            Number(state?.memberId)
                              ? 'true'
                              : 'false'
                          }
                          nickname={comment.memberInfo.nickname}
                          userimg={comment.memberInfo.imageURL}
                          content={comment.content}
                          commentid={comment.feedCommentsId}
                          feedid={getGuestFeed.data.feedId}
                          blankhandler={setIsOpen}
                          memberid={comment.memberInfo.memberId}
                          time={changeTime(comment.createdAt)}
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
              />
            </FeedCardContainer>
          </>
        ) : (
          <Container
            onClick={e => {
              if (e.target === e.currentTarget) navigate(-1);
            }}>
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
                      <FeedComment
                        key={comment.feedCommentsId}
                        inperson={
                          comment.memberInfo.memberId ===
                          Number(state?.memberId)
                            ? 'true'
                            : 'false'
                        }
                        nickname={comment.memberInfo.nickname}
                        userimg={comment.memberInfo.imageURL}
                        content={comment.content}
                        commentid={comment.feedCommentsId}
                        feedid={getGuestFeed.data.feedId}
                        blankhandler={setIsOpen}
                        memberid={comment.memberInfo.memberId}
                        time={changeTime(comment.createdAt)}
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
