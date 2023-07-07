import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Profile from '../../../common/profile/Profile';
import '../../../common/carousel/carousel.css';
import {
  Container,
  Feed,
  ContentContainer,
  Wrap,
  UserName,
  Context,
  More,
} from './FeedCard.styled';

interface Prop {
  memberid: number;
  username: string;
  context: string;
  url: string;
}

export default function FeedCard({ memberid, username, context, url }: Prop) {
  const navigate = useNavigate();
  const [isMore, setIsMore] = useState(false);

  return (
    <Container>
      <Swiper
        pagination={{
          type: 'fraction',
        }}
        navigation={true}
        modules={[Navigation]}
        className="w-96 h-[568px] rounded-[28px]">
        <SwiperSlide className="flex justify-center items-center relative bg-slate-100">
          <Feed onClick={() => setIsMore(false)} />
          <ContentContainer>
            <Wrap onClick={() => navigate(`/users/${memberid}`)}>
              <Profile size="sm" isgreen="false" url={url} />
              <UserName>{username}</UserName>
            </Wrap>

            {!isMore && (
              <Wrap>
                <Context ismore="false">{context.slice(0, 15)}</Context>
                <More onClick={() => setIsMore(true)}>더보기</More>
              </Wrap>
            )}

            {isMore && (
              <Wrap>
                <Context ismore="true">{context}</Context>
              </Wrap>
            )}
          </ContentContainer>
        </SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
      </Swiper>
    </Container>
  );
}
