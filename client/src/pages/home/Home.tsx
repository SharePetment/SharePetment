/* eslint-disable react-hooks/exhaustive-deps */
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { getGuestFeedList, getHostFeedList } from '../../api/queryfn.ts';
import { SERVER_URL } from '../../api/url.ts';
import LyingDownDog from '../../assets/illustration/lying-down-dog.png';
import PetFriends from '../../assets/illustration/pet-friends.png';
import { PopupBackGround } from '../../common/popup/popup.styled.tsx';
import Popup from '../../common/popup/Popup.tsx';
import FeedCard from '../../components/card/feed-card/FeedCard.tsx';
import SideNav from '../../components/card/sidenav/SideNav.tsx';
import LoadingComponent from '../../components/loading/LoadingComponent.tsx';
import NoticeServerError from '../../components/notice/NoticeServerError.tsx';
import Toast from '../../components/toast/Toast.tsx';
import { Feed } from '../../types/feedTypes.ts';
import CircleProgressBar from './CricleProgressBar.tsx';
import { Container, ReBtn, TopBtn } from './Home.styled.tsx';
import '../../common/carousel/carousel.css';

export function Component() {
  const queryClient = useQueryClient();
  const accessToken = useReadLocalStorage<string>('accessToken');
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
  } = useInfiniteQuery({
    queryKey: ['guestFeed'],
    staleTime: 600000,
    refetchOnMount: false,
    cacheTime: 600000,
    queryFn: ({ pageParam = 0 }) => {
      return getGuestFeedList(
        `${SERVER_URL}/feeds/all/list/random?page=${pageParam}&size=10`,
      );
    },
    getNextPageParam: (_, allPages) => {
      const len = allPages.length;
      const totalLength = allPages.length;
      return allPages[totalLength - 1].length === 0 ? undefined : len;
    },
    enabled: accessToken === null,
  });

  // Host 요청
  const {
    data: hostData,
    fetchNextPage: fetchNextPageHost,
    isSuccess: hostIsSucess,
    isError: hostIsError,
    isLoading: hostIsLoading,
  } = useInfiniteQuery({
    queryKey: ['hostFeed'],
    queryFn: ({ pageParam = 0 }) => {
      return getHostFeedList(
        `${SERVER_URL}/feeds/list?page=${pageParam}&size=10`,
        accessToken,
      );
    },
    staleTime: 600000,
    cacheTime: 600000,
    refetchOnMount: false,
    getNextPageParam: (_, allPages) => {
      const len = allPages.length;
      const totalLength = allPages.length;
      return allPages[totalLength - 1].length === 0 ? undefined : len;
    },
    enabled: !!accessToken,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contextApi'] });
    },
  });

  // 무한 쿼리 구현
  // 게스트  요청
  const { ref: guestRef, inView: guestInview } = useInView();
  // host 요청
  const { ref: hostRef, inView: hostInview } = useInView();

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
  if (hostIsSucess && accessToken) {
    return (
      <>
        {/* 웰컴팝업 */}
        {isFirstVisited && (
          <PopupBackGround>
            <Swiper
              pagination={{
                type: 'fraction',
              }}
              navigation={true}
              modules={[Navigation]}
              className=" w-[400px] h-[280px] rounded-[40px] max-sm:w-[340px]">
              <SwiperSlide className=" bg-defaultbg">
                <div className="flex flex-col justify-center items-center h-full font-semibold">
                  다양한 반려동물을 구경할 수 있어요.
                  <img src={PetFriends} className=" w-60" />
                  <CircleProgressBar circle={{ index: 0, total: 3 }} />
                </div>
              </SwiperSlide>
              <SwiperSlide className=" bg-defaultbg">
                <div className="flex flex-col justify-center items-center h-full font-semibold">
                  <span className="text-center max-sm:w-52">
                    우리집 반려동물의 산책 친구를 만들어줄 수 있어요.
                  </span>
                  <img src={LyingDownDog} className=" w-60" />
                  <CircleProgressBar circle={{ index: 1, total: 3 }} />
                </div>
              </SwiperSlide>
              <SwiperSlide className=" bg-defaultbg">
                <div className="flex flex-col justify-center items-center h-full gap-10 font-semibold">
                  여러분의 반려동물을 등록해보세요!
                  <div className="flex gap-5">
                    <button
                      className="bg-deepgreen text-white w-[120px]  h-[50px]
                      text-base rounded-2xl max-sm:text-xs max-sm:w-[90px]"
                      onClick={() => {
                        navigate('/my-page');
                        setFirstVisited(false);
                      }}>
                      네, 등록할래요!
                    </button>
                    <button
                      className="bg-white text-deepgreen w-[120px]  h-[50px]
                      text-base rounded-2xl max-sm:w-[90px] max-sm:text-xs"
                      onClick={() => {
                        navigate('/home');
                        setFirstVisited(false);
                      }}>
                      아뇨, 괜찮습니다!
                    </button>
                  </div>
                  <CircleProgressBar circle={{ index: 2, total: 3 }} />
                </div>
              </SwiperSlide>
            </Swiper>
          </PopupBackGround>
        )}
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
        {isScrolled > 500 && <TopBtn onClick={handleTopScroll}>↑</TopBtn>}
        {window.innerWidth > 500 && (
          <div className="w-screen flex flex-col gap-16 justify-center items-center my-12">
            {hostData.pages.map((page, index) => (
              <React.Fragment key={index}>
                {page.map((img: Feed) => (
                  <div className="flex items-center gap-3" ref={hostRef}>
                    <FeedCard
                      memberid={img.memberInfo.memberId}
                      username={img.memberInfo.nickname}
                      context={img.content}
                      userimg={img.memberInfo.imageURL}
                      images={img.images}
                      guesthandler={() => setIsGuestOpen(true)}
                    />
                    <SideNav
                      feedid={img.feedId}
                      direction={window.innerWidth < 640 ? 'row' : 'col'}
                      likes={img.likes}
                      like={img.isLike ? 'true' : 'false'}
                      guesthandler={() => setIsGuestOpen(true)}
                      toasthandler={setIsToastOpen}
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}

            {hostData.pages[hostData.pages.length - 1].length === 0 && (
              <ReBtn
                className={
                  window.innerWidth < 430 ? 'bottom-[80px]' : 'bottom-10'
                }
                onClick={() => {
                  window.location.reload();
                }}>
                피드 다시 받아오기
              </ReBtn>
            )}
          </div>
        )}
        {window.innerWidth < 500 && (
          <Container>
            <Swiper
              direction={'vertical'}
              slidesPerView={
                window.innerWidth < 500
                  ? window.innerWidth < 400
                    ? 1
                    : 1.5
                  : 1.1
              }
              mousewheel={true}
              modules={[Mousewheel, Pagination]}
              className={
                window.innerWidth < 500
                  ? window.innerWidth < 400
                    ? 'w-full h-full flex flex-col items-center justify-center'
                    : 'w-full h-full flex flex-col items-center justify-center mb-30'
                  : 'w-full h-full flex flex-col items-center justify-center'
              }>
              {hostData.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.map((img: Feed) => (
                    <SwiperSlide
                      className="w-96 max-sm:w-full max-sm:h-full"
                      key={img.feedId}>
                      <div
                        className="flex justify-center items-center gap-5 max-sm:flex-col"
                        ref={hostRef}>
                        <FeedCard
                          memberid={img.memberInfo.memberId}
                          username={img.memberInfo.nickname}
                          context={img.content}
                          userimg={img.memberInfo.imageURL}
                          images={img.images}
                          guesthandler={() => setIsGuestOpen(true)}
                        />
                        <SideNav
                          feedid={img.feedId}
                          direction={window.innerWidth < 640 ? 'row' : 'col'}
                          likes={img.likes}
                          like={img.isLike ? 'true' : 'false'}
                          guesthandler={() => setIsGuestOpen(true)}
                          toasthandler={setIsToastOpen}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </React.Fragment>
              ))}
            </Swiper>
            {hostData.pages[hostData.pages.length - 1].length === 0 && (
              <ReBtn
                className={
                  window.innerWidth < 430 ? 'bottom-[80px]' : 'bottom-10'
                }
                onClick={() => {
                  window.location.reload();
                }}>
                피드 다시 받아오기
              </ReBtn>
            )}
          </Container>
        )}
      </>
    );
  } else {
    return (
      guestIsSucess &&
      !accessToken && (
        <>
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
          {isGuestOpen && (
            <Popup
              title="로그인을 해주세요."
              isgreen={['true']}
              btnsize={['md']}
              buttontext={['로그인하러가기']}
              countbtn={1}
              handler={[() => navigate('/')]}
              popupcontrol={() => setIsGuestOpen(false)}
            />
          )}
          {isScrolled > 500 && <TopBtn onClick={handleTopScroll}>↑</TopBtn>}
          {window.innerWidth > 500 && (
            <div className="w-screen flex flex-col gap-16 justify-center items-center my-12">
              {guestData.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.map((img: Feed) => (
                    <div className="flex items-center gap-3" ref={guestRef}>
                      <FeedCard
                        memberid={img.memberInfo.memberId}
                        username={img.memberInfo.nickname}
                        context={img.content}
                        userimg={img.memberInfo.imageURL}
                        images={img.images}
                        guesthandler={() => setIsGuestOpen(true)}
                      />
                      <SideNav
                        feedid={img.feedId}
                        direction={window.innerWidth < 640 ? 'row' : 'col'}
                        likes={img.likes}
                        like={img.isLike ? 'true' : 'false'}
                        guesthandler={() => setIsGuestOpen(true)}
                        toasthandler={setIsToastOpen}
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}

              {guestData.pages[guestData.pages.length - 1].length === 0 && (
                <ReBtn
                  className={
                    window.innerWidth < 430 ? 'bottom-[80px]' : 'bottom-10'
                  }
                  onClick={() => {
                    window.location.reload();
                  }}>
                  피드 다시 받아오기
                </ReBtn>
              )}
            </div>
          )}
          {window.innerWidth < 500 && (
            <Container>
              <Swiper
                direction={'vertical'}
                slidesPerView={window.innerWidth < 400 ? 1 : 1.1}
                mousewheel={true}
                modules={[Mousewheel, Pagination]}
                className="w-full h-full flex flex-col items-center justify-center">
                {guestData.pages.map((page, index) => (
                  <React.Fragment key={index}>
                    {page.map((img: Feed) => (
                      <SwiperSlide className="w-96" key={img.feedId}>
                        <div
                          className="flex justify-center items-center gap-5 max-sm:flex-col"
                          ref={guestRef}>
                          <FeedCard
                            memberid={img.memberInfo.memberId}
                            username={img.memberInfo.nickname}
                            context={img.content}
                            userimg={img.memberInfo.imageURL}
                            images={img.images}
                            guesthandler={() => setIsGuestOpen(true)}
                          />
                          <SideNav
                            feedid={img.feedId}
                            direction={window.innerWidth < 640 ? 'row' : 'col'}
                            likes={img.likes}
                            like={img.isLike ? 'true' : 'false'}
                            guesthandler={() => setIsGuestOpen(true)}
                            toasthandler={setIsToastOpen}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </React.Fragment>
                ))}
              </Swiper>
              {guestData.pages[guestData.pages.length - 1].length === 0 && (
                <ReBtn
                  className={
                    window.innerWidth < 430 ? 'bottom-[80px]' : 'bottom-10'
                  }
                  onClick={() => {
                    window.location.reload();
                  }}>
                  피드 다시 받아오기
                </ReBtn>
              )}
            </Container>
          )}
        </>
      )
    );
  }
}

Component.displayName = 'Home';
