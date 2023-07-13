import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mousewheel, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { useReadLocalStorage } from 'usehooks-ts';
import { deleteFeed } from '../../api/mutationfn';
import { getGuestFeedList, getHostFeedList } from '../../api/queryfn';
import { SERVER_URL } from '../../api/url';
import FollowingCat from '../../assets/illustration/followingcat.png';
import Popup from '../../common/popup/Popup';
import FeedCard from '../../components/card/feedcard/FeedCard';
import SideNav from '../../components/card/sidenav/SideNav';
import { Feed } from '../../types/feedTypes';
import { Container, FollowContainer, Img, Text, Button } from './Home.styled';

export function Component() {
  const memberId = useReadLocalStorage<string>('memberId');
  const accessToken = useReadLocalStorage<string>('accessToken');
  const [isClicked, setIsClicked] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isGuestOpen, setIsGuestOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const guestFeedQuery = useQuery({
    queryKey: ['guestFeed'],
    queryFn: () =>
      getGuestFeedList(`${SERVER_URL}feeds/all/list/random`, memberId),
    enabled: !!(memberId === null || isClicked),
  });

  const hostFeedQuery = useQuery({
    queryKey: ['hostFeed'],
    queryFn: () =>
      getHostFeedList(`${SERVER_URL}feeds/list/${memberId}`, accessToken),
    enabled: !!memberId,
  });

  const deleteFeedMutation = useMutation({
    mutationFn: deleteFeed,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['guestFeed'] }),
  });

  const handlePopUp = useCallback(() => {
    const feedId = localStorage.getItem('feedId');
    deleteFeedMutation.mutate({
      url: `${SERVER_URL}feeds/${feedId}/${memberId}`,
      accessToken,
    });
    localStorage.removeItem('feedId');
    setIsDeleteOpen(false);
  }, [accessToken, deleteFeedMutation, memberId]);

  if (
    memberId &&
    hostFeedQuery.isSuccess &&
    hostFeedQuery.data.responseList.length === 0 &&
    !isClicked
  ) {
    return (
      <FollowContainer>
        <Img src={FollowingCat} />
        <Text>
          아직 구독하는 사람이 없어요.
          <br />
          랜덤으로 피드를 추천받으세요!
        </Text>
        <Button onClick={() => setIsClicked(true)}>추천받기</Button>
      </FollowContainer>
    );
  } else if (memberId && hostFeedQuery.isSuccess && !isClicked) {
    return (
      <>
        {isDeleteOpen && (
          <Popup
            title="피드를 삭제할까요?"
            isgreen={['true']}
            btnsize={['md']}
            buttontext={['삭제할래요']}
            countbtn={1}
            handler={[handlePopUp]}
            popupcontrol={() => {
              setIsDeleteOpen(false);
              localStorage.removeItem('feedId');
            }}
          />
        )}
        <Container>
          <Swiper
            direction={'vertical'}
            slidesPerView={window.innerWidth < 400 ? 1 : 1.1}
            mousewheel={true}
            modules={[Mousewheel, Pagination]}
            className="w-full h-full flex flex-col items-center justify-center">
            {hostFeedQuery.data.responseList.map((img: Feed) => (
              <SwiperSlide className="w-96 max-sm:w-full max-sm:h-full">
                <div className="flex justify-center items-center gap-5 max-sm:flex-col">
                  <FeedCard
                    memberid={img.memberInfo.memberId}
                    username={img.memberInfo.nickname}
                    context={img.content}
                    userimg={img.memberInfo.imageURL}
                    images={img.images}
                  />
                  <SideNav
                    feedid={img.feedId}
                    direction={window.innerWidth < 640 ? 'row' : 'col'}
                    inperson={`${memberId === String(img.memberInfo.memberId)}`}
                    likes={img.likes}
                    like={img.isLike ? 'true' : 'false'}
                    deletehandler={() => setIsDeleteOpen(true)}
                    guesthandler={() => setIsGuestOpen(true)}
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
      (guestFeedQuery.isSuccess || (guestFeedQuery.isSuccess && isClicked)) && (
        <>
          {isDeleteOpen && (
            <Popup
              title="피드를 삭제할까요?"
              isgreen={['true']}
              btnsize={['md']}
              buttontext={['삭제할래요']}
              countbtn={1}
              handler={[handlePopUp]}
              popupcontrol={() => {
                setIsDeleteOpen(false);
                localStorage.removeItem('feedId');
              }}
            />
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
                      />
                      <SideNav
                        feedid={img.feedId}
                        direction={window.innerWidth < 640 ? 'row' : 'col'}
                        inperson={`${
                          memberId === String(img.memberInfo.memberId)
                        }`}
                        likes={img.likes}
                        like={img.isLike ? 'true' : 'false'}
                        deletehandler={() => setIsDeleteOpen(true)}
                        guesthandler={() => setIsGuestOpen(true)}
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
