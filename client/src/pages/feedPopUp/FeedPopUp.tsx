import { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReadLocalStorage } from 'usehooks-ts';
import { SERVER_URL } from '@/api/url.ts';
import AlertText from '@/common/popup/AlertText';
import Popup from '@/common/popup/Popup';
import CommentContainer from '@/components/feedpopup-page/commentContainer/CommentContainer';
import DesktopContainer from '@/components/feedpopup-page/desktopContainer/DesktopContainer';
import FeedCardContainer from '@/components/feedpopup-page/feedCardContainer/FeedCardContainer';
import LoadingComponent from '@/components/loading/LoadingComponent';
import NoticeServerError from '@/components/notice/NoticeServerError';
import useDeleteMutation from '@/hook/api/mutation/useDeleteMutation';
import useGuestFeedQuery from '@/hook/api/query/useGuestFeedQuery';
import useHostFeedQuery from '@/hook/api/query/useHostFeedQuery';
import useHandleKeyBoard from '@/hook/useHandleKeyBoard';
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
            popupcontrol={() => setIsDeleteOpen(false)}
          />
        )}
        {window.innerWidth < 420 ? (
          <>
            {isCommentOpen && (
              <CommentContainer
                data={data}
                setIsCommentOpen={setIsCommentOpen}
                setIsOpen={setIsOpen}
              />
            )}
            <FeedCardContainer
              data={data}
              isToastOpen={isToastOpen}
              setIsDeleteOpen={setIsDeleteOpen}
              setIsCommentOpen={setIsCommentOpen}
              setIsOpen={setIsOpen}
              setIsToastOpen={setIsToastOpen}
              state={state}
            />
          </>
        ) : (
          <DesktopContainer
            isToastOpen={isToastOpen}
            data={data}
            setIsDeleteOpen={setIsDeleteOpen}
            setIsOpen={setIsOpen}
            setIsToastOpen={setIsToastOpen}
            state={state}
          />
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
                data={getGuestFeed.data}
                setIsCommentOpen={setIsCommentOpen}
                setIsOpen={setIsOpen}
              />
            )}
            <FeedCardContainer
              data={getGuestFeed.data}
              isToastOpen={isToastOpen}
              setIsDeleteOpen={setIsDeleteOpen}
              setIsCommentOpen={setIsCommentOpen}
              setIsOpen={setIsOpen}
              setIsToastOpen={setIsToastOpen}
              state={state}
            />
          </>
        ) : (
          <DesktopContainer
            isToastOpen={isToastOpen}
            data={getGuestFeed.data}
            setIsDeleteOpen={setIsDeleteOpen}
            setIsOpen={setIsOpen}
            setIsToastOpen={setIsToastOpen}
            state={state}
          />
        )}
      </>
    );
}

Component.displayName = 'FeedPopUp';
