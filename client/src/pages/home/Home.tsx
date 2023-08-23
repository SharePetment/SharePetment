/* eslint-disable react-hooks/exhaustive-deps */
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { getGuestFeedList, getHostFeedList } from '@/api/queryfn.ts';
import AlertText from '@/common/popup/AlertText';
import Popup from '@/common/popup/Popup.tsx';
import HomeCellphone from '@/components/home-page/homeContainer/HomeCellphone';
import HomeComputer from '@/components/home-page/homeContainer/HomeComputer';
import WelcomePopup from '@/components/home-page/welcome-popup/WelcomePopup';
import LoadingComponent from '@/components/loading/LoadingComponent.tsx';
import NoticeServerError from '@/components/notice/NoticeServerError.tsx';
import Toast from '@/components/toast/Toast.tsx';
import UseInfinityScroll from '@/hook/api/query/useInfinityScroll';
import * as SC from '@/pages/home/Home.styled.tsx';
import Path from '@/routers/paths.ts';
import { Feed } from '@/types/feedTypes.ts';

export function Component() {
  const queryClient = useQueryClient();
  const accessToken = useReadLocalStorage<string | null>('accessToken');
  const [isFirstVisited, setFirstVisited] = useLocalStorage(
    'firstVisited',
    true,
  );

  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [isGuestOpen, setIsGuestOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<number>(0);

  const navigate = useNavigate();
  // Guest 요청
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['hostFeed'] });
  }, []);

  const {
    data: guestData,
    fetchNextPage: fetchNextPageGuest,
    isSuccess: guestIsSucess,
    isError: guestIsError,
    isLoading: guestIsLoading,
    ref: guestRef,
    inView: guestInview,
  } = UseInfinityScroll<Feed>({
    queryKey: `guestFeed`,
    fn: getGuestFeedList,
    enabledValue: accessToken,
  });

  // Host 요청
  const {
    data: hostData,
    fetchNextPage: fetchNextPageHost,
    isSuccess: hostIsSucess,
    isError: hostIsError,
    isLoading: hostIsLoading,
    ref: hostRef,
    inView: hostInview,
  } = UseInfinityScroll<Feed>({
    queryKey: `hostFeed`,
    fn: getHostFeedList,
    enabledValue: accessToken,
  });

  // 구독자가 있는 경우
  useEffect(() => {
    if (hostInview) {
      fetchNextPageHost();
    }
  }, [hostInview]);

  // 비로그인 및 구독자가 없는 경우
  useEffect(() => {
    if (guestInview) {
      fetchNextPageGuest();
    }
  }, [guestInview]);

  // 스크롤 이벤트
  const handleScroll = () => setIsScrolled(window.scrollY);
  const handleTopScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 로딩화면 보여주기
  if (guestIsLoading && hostIsLoading) {
    return <LoadingComponent />;
  }

  // 데이터 처리 실패화면 보여주기
  if (guestIsError || hostIsError) {
    return (
      <div className="flex h-screen w-screen items-center justify-center ">
        <NoticeServerError />
      </div>
    );
  }
  return (
    <>
      {/*링크 복사 Toast */}
      {isToastOpen && (
        <div
          className={
            window.innerWidth < 420
              ? 'fixed top-5 right-2 z-50'
              : 'fixed top-28 right-8 z-50'
          }>
          <Toast />
        </div>
      )}

      {/*스크롤 버튼 */}
      {isScrolled > 500 && <SC.TopBtn onClick={handleTopScroll}>↑</SC.TopBtn>}

      {/* 로그인 유저일시*/}
      {hostIsSucess && accessToken && (
        <>
          {/* 웰컴팝업 */}
          {isFirstVisited && <WelcomePopup setFirstVisited={setFirstVisited} />}

          {/* 컴퓨터 화면일시 디자인 처리*/}
          {window.innerWidth > 500 && (
            <HomeComputer
              refValue={hostRef}
              data={hostData}
              setIsGuestOpen={setIsGuestOpen}
              setIsToastOpen={setIsToastOpen}
            />
          )}

          {/*휴대폰 화면일시 디자인 처리 */}
          {window.innerWidth < 500 && (
            <HomeCellphone
              refValue={hostRef}
              data={hostData}
              setIsGuestOpen={setIsGuestOpen}
              setIsToastOpen={setIsToastOpen}
            />
          )}
        </>
      )}

      {/* 비로그인 유저일시*/}
      {guestIsSucess && !accessToken && (
        <>
          {isGuestOpen && (
            <Popup
              title={AlertText.Login}
              buttontext={['로그인하러가기']}
              handler={[() => navigate(Path.Login)]}
              popupcontrol={() => setIsGuestOpen(false)}
            />
          )}

          {/* 컴퓨터 화면일시 디자인 처리*/}
          {window.innerWidth > 500 && (
            <HomeComputer
              refValue={guestRef}
              data={guestData}
              setIsGuestOpen={setIsGuestOpen}
              setIsToastOpen={setIsToastOpen}
            />
          )}

          {/*휴대폰 화면일시 디자인 처리 */}
          {window.innerWidth < 500 && (
            <HomeCellphone
              refValue={guestRef}
              data={guestData}
              setIsGuestOpen={setIsGuestOpen}
              setIsToastOpen={setIsToastOpen}
            />
          )}
        </>
      )}
    </>
  );
}

Component.displayName = 'Home';
