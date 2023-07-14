import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mousewheel, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { useReadLocalStorage } from 'usehooks-ts';
import { getGuestFeedList, getHostFeedList } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import FollowingCat from '../../assets/illustration/followingcat.png';
import Popup from '../../common/popup/Popup';
import FeedCard from '../../components/card/feedcard/FeedCard';
import SideNav from '../../components/card/sidenav/SideNav';
import Toast from '../../components/toast/Toast';
import { Feed } from '../../types/feedTypes';
import { Container, FollowContainer, Img, Text, Button } from './Home.styled';

export function Component() {
  const accessToken = useReadLocalStorage<string>('accessToken');
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [isGuestOpen, setIsGuestOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const guestFeedQuery = useQuery({
    queryKey: ['guestFeed'],
    queryFn: () => getGuestFeedList(`${SERVER_URL}/feeds/all/list/random`),
    enabled: !!(accessToken === null),
  });

  const hostRandomFeedQuery = useQuery({
    queryKey: ['hostRandomFeed'],
    queryFn: () =>
      getHostFeedList(`${SERVER_URL}/feeds/list/random`, accessToken),
    enabled: !!(accessToken && isClicked),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['contextApi'] });
    },
  });

  const hostFeedQuery = useQuery({
    queryKey: ['hostFeed'],
    queryFn: () => getHostFeedList(`${SERVER_URL}/feeds/list`, accessToken),
    enabled: !!accessToken,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['contextApi'] });
    },
  });

  if (
    hostFeedQuery.isSuccess &&
    hostFeedQuery.data.responseList.length === 0 &&
    !isClicked &&
    accessToken
  ) {
    return (
      <FollowContainer>
        <Img src={FollowingCat} />
        <Text>
          아직 올라온 피드가 없어요.
          <br />
          랜덤으로 피드를 추천받으세요!
        </Text>
        <Button onClick={() => setIsClicked(true)}>추천받기</Button>
      </FollowContainer>
    );
  } else if (hostFeedQuery.isSuccess && !isClicked) {
    return (
      <>
        {isToastOpen && (
          <div className="fixed right-8 bottom-8">
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
            ))}
          </Swiper>
        </Container>
      </>
    );
  } else if (hostRandomFeedQuery.isSuccess) {
    return (
      <>
        {isToastOpen && (
          <div className="fixed right-8 bottom-8">
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
            {hostRandomFeedQuery.data.responseList.map(
              (img: Feed, idx: number) => (
                <SwiperSlide
                  className="w-96 max-sm:w-full max-sm:h-full"
                  key={idx}>
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
