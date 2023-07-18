import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { getGuestFeedList, getHostFeedList } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import LyingDownDog from '../../assets/illustration/lying-down-dog.png';
import PetFriends from '../../assets/illustration/pet-friends.png';
import Popup from '../../common/popup/Popup';
import { PopupBackGround } from '../../common/popup/popup.styled';
import FeedCard from '../../components/card/feed-card/FeedCard';
import SideNav from '../../components/card/sidenav/SideNav';
import Toast from '../../components/toast/Toast';
import { Feed } from '../../types/feedTypes';
import CircleProgressBar from './CricleProgressBar';
import { Container } from './Home.styled';
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

  const navigate = useNavigate();

  const guestFeedQuery = useQuery({
    queryKey: ['guestFeed'],
    queryFn: () => getGuestFeedList(`${SERVER_URL}/feeds/all/list/random`),
    enabled: !!(accessToken === null),
  });

  const hostFeedQuery = useQuery({
    queryKey: ['hostFeed'],
    queryFn: () => getHostFeedList(`${SERVER_URL}/feeds/list`, accessToken),
    enabled: !!accessToken,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['contextApi'] });
    },
  });

  // 무한 쿼리 구현
  const { ref, inView } = useInView();

  useEffect(() => {
    console.log('done');
  }, [inView]);

  if (hostFeedQuery.isSuccess && accessToken) {
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
          <div className="fixed top-20 right-8">
            <Toast />
          </div>
        )}
        <Container>
          <Swiper
            direction={'vertical'}
            slidesPerView={window.innerWidth < 400 ? 1 : 1.1}
            mousewheel={true}
            modules={[Mousewheel, Pagination]}
            className="w-full h-full flex flex-col items-center justify-center">
            {hostFeedQuery.data.responseList.map((img: Feed, idx: number) => (
              <SwiperSlide
                className="w-96 max-sm:w-full max-sm:h-full"
                key={idx}>
                <div
                  className="flex justify-center items-center gap-5 max-sm:flex-col"
                  ref={ref}>
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
                    url={img.shareURL}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </>
    );
  } else {
    return (
      guestFeedQuery.isSuccess &&
      !accessToken && (
        <>
          {isToastOpen && (
            <div className="fixed right-8 bottom-8">
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
          <Container>
            <Swiper
              direction={'vertical'}
              slidesPerView={window.innerWidth < 400 ? 1 : 1.1}
              mousewheel={true}
              modules={[Mousewheel, Pagination]}
              className="w-full h-full flex flex-col items-center justify-center">
              {guestFeedQuery.data.responseList.map(
                (img: Feed, idx: number) => (
                  <SwiperSlide className="w-96" key={idx}>
                    <div className="flex justify-center items-center gap-5 max-sm:flex-col">
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
                        url={img.shareURL}
                      />
                    </div>
                  </SwiperSlide>
                ),
              )}
            </Swiper>
          </Container>
        </>
      )
    );
  }
}

Component.displayName = 'Home';
