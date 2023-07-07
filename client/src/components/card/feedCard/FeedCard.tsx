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

interface ImagesStructure {
  imageId: number;
  originalFilename: string;
  uploadFileURL: string;
}

interface Prop {
  memberid: number;
  username: string;
  context: string;
  userimg: string;
  images: ImagesStructure[];
}

export default function FeedCard({
  memberid,
  username,
  context,
  userimg,
  images,
}: Prop) {
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
        className="w-96 max-sm:w-80 h-[520px] rounded-[28px]">
        {images.map(image => (
          <SwiperSlide
            className="flex justify-center items-center relative bg-slate-100"
            key={image.imageId}>
            <Feed onClick={() => setIsMore(false)} src={image.uploadFileURL} />
            <ContentContainer>
              <Wrap onClick={() => navigate(`/users/${memberid}`)}>
                <Profile size="sm" isgreen="false" url={userimg} />
                <UserName>{username}</UserName>
              </Wrap>

              {!isMore && (
                <Wrap>
                  <Context ismore="false">{context.slice(0, 15)}</Context>
                  {context.length > 15 && (
                    <More onClick={() => setIsMore(true)}>더보기</More>
                  )}
                </Wrap>
              )}

              {isMore && (
                <Wrap>
                  <Context ismore="true">{context}</Context>
                </Wrap>
              )}
            </ContentContainer>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}
