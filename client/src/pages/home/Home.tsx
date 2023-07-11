import { Mousewheel, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import FeedCard from '../../components/card/feedcard/FeedCard';
import SideNav from '../../components/card/sidenav/SideNav';
import { Container } from './Home.styled';
export function Component() {
  return (
    <Container>
      <Swiper
        direction={'vertical'}
        slidesPerView={window.innerWidth < 400 ? 1 : 1.1}
        mousewheel={true}
        modules={[Mousewheel, Pagination]}
        className="w-full h-full flex flex-col items-center justify-center">
        <SwiperSlide className="w-96 max-sm:w-full max-sm:h-full">
          <div className="flex justify-center items-center gap-5 max-sm:flex-col">
            <FeedCard
              memberid={1}
              username="hello_wolrd"
              context="위하여서, 두기 같은 그림자는 그들은 그리하였는가? 같지 얼음과 긴지라 능히 황금시대다. 사라지지 가지에 우리의 석가는 곧 꽃 설산에서 이것이다. 반짝이는 찾아다녀도, 우리는 인간의 봄바람이다. 황금시대를 그것을 가장 위하여 대한 사는가 구하지 청춘은 힘있다."
              userimg="https://img.freepik.com/free-photo/adorable-kitty-looking-like-it-want-to-hunt_23-2149167099.jpg"
              images={[
                {
                  imageId: 9,
                  originalFilename: '201701731-김준영.png',
                  uploadFileURL:
                    'https://www.kgnews.co.kr/data/photos/20220832/art_16599350966819_1053f2.jpg',
                },
                {
                  imageId: 10,
                  originalFilename: '201701731-김준영.png',
                  uploadFileURL:
                    'https://www.kgnews.co.kr/data/photos/20220832/art_16599350966819_1053f2.jpg',
                },
                {
                  imageId: 11,
                  originalFilename: '201701731-김준영.png',
                  uploadFileURL:
                    'https://www.kgnews.co.kr/data/photos/20220832/art_16599350966819_1053f2.jpg',
                },
              ]}
            />
            <SideNav
              feedid={9}
              direction={window.innerWidth < 640 ? 'row' : 'col'}
              inperson="true"
              likes={200}
              like="true"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide className="w-96">
          <div className="flex justify-center items-center gap-5 max-sm:flex-col">
            <FeedCard
              memberid={1}
              username="hello_wolrd"
              context="위하여서, 두기 같은 그림자는 그들은 그리하였는가? 같지 얼음과 긴지라 능히 황금시대다. 사라지지 가지에 우리의 석가는 곧 꽃 설산에서 이것이다. 반짝이는 찾아다녀도, 우리는 인간의 봄바람이다. 황금시대를 그것을 가장 위하여 대한 사는가 구하지 청춘은 힘있다."
              userimg="https://img.freepik.com/free-photo/adorable-kitty-looking-like-it-want-to-hunt_23-2149167099.jpg"
              images={[
                {
                  imageId: 9,
                  originalFilename: '201701731-김준영.png',
                  uploadFileURL:
                    'https://www.kgnews.co.kr/data/photos/20220832/art_16599350966819_1053f2.jpg',
                },
                {
                  imageId: 10,
                  originalFilename: '201701731-김준영.png',
                  uploadFileURL:
                    'https://www.kgnews.co.kr/data/photos/20220832/art_16599350966819_1053f2.jpg',
                },
                {
                  imageId: 11,
                  originalFilename: '201701731-김준영.png',
                  uploadFileURL:
                    'https://www.kgnews.co.kr/data/photos/20220832/art_16599350966819_1053f2.jpg',
                },
              ]}
            />
            <SideNav
              feedid={9}
              direction={window.innerWidth < 640 ? 'row' : 'col'}
              inperson="true"
              likes={10}
              like="true"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide className="w-96">
          <div className="flex justify-center items-center gap-5 max-sm:flex-col">
            <FeedCard
              memberid={1}
              username="hello_wolrd"
              context="위하여서, 두기 같은 그림자는 그들은 그리하였는가? 같지 얼음과 긴지라 능히 황금시대다. 사라지지 가지에 우리의 석가는 곧 꽃 설산에서 이것이다. 반짝이는 찾아다녀도, 우리는 인간의 봄바람이다. 황금시대를 그것을 가장 위하여 대한 사는가 구하지 청춘은 힘있다."
              userimg="https://img.freepik.com/free-photo/adorable-kitty-looking-like-it-want-to-hunt_23-2149167099.jpg"
              images={[
                {
                  imageId: 9,
                  originalFilename: '201701731-김준영.png',
                  uploadFileURL:
                    'https://www.kgnews.co.kr/data/photos/20220832/art_16599350966819_1053f2.jpg',
                },
                {
                  imageId: 10,
                  originalFilename: '201701731-김준영.png',
                  uploadFileURL:
                    'https://www.kgnews.co.kr/data/photos/20220832/art_16599350966819_1053f2.jpg',
                },
                {
                  imageId: 11,
                  originalFilename: '201701731-김준영.png',
                  uploadFileURL:
                    'https://www.kgnews.co.kr/data/photos/20220832/art_16599350966819_1053f2.jpg',
                },
              ]}
            />
            <SideNav
              feedid={9}
              direction={window.innerWidth < 640 ? 'row' : 'col'}
              inperson="true"
              likes={300}
              like="false"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </Container>
  );
}

Component.displayName = 'Home';
