import { useNavigate } from 'react-router-dom';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import LyingDownDog from '@/assets/illustration/lying-down-dog.png';
import LyingDownDogWebp from '@/assets/illustration/lying-down-dog.webp';
import PetFriends from '@/assets/illustration/pet-friends.png';
import PetFriendsWebp from '@/assets/illustration/pet-friends.webp';
import * as SC from '@/common/popup/popup.styled.tsx';
import CircleProgressBar from '@/components/home-page/welcome-popup/CricleProgressBar';
import Path from '@/routers/paths';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type Prop = {
  setFirstVisited: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function WelcomePopup({ setFirstVisited }: Prop) {
  const navigate = useNavigate();
  return (
    <SC.PopupBackGround>
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
            <picture>
              <source srcSet={PetFriendsWebp} type="image/webp" />
              <img src={PetFriends} className=" w-60" alt="petFrends" />
            </picture>
            <CircleProgressBar circle={{ index: 0, total: 3 }} />
          </div>
        </SwiperSlide>
        <SwiperSlide className=" bg-defaultbg">
          <div className="flex flex-col justify-center items-center h-full font-semibold">
            <span className="text-center max-sm:w-52">
              우리집 반려동물의 산책 친구를 만들어줄 수 있어요.
            </span>
            <picture>
              <source srcSet={LyingDownDogWebp} type="image/webp" />
              <img src={LyingDownDog} className=" w-60" alt="LyingDownDog" />
            </picture>
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
                  navigate(Path.MyPage);
                  setFirstVisited(false);
                }}>
                네, 등록할래요!
              </button>
              <button
                className="bg-white text-deepgreen w-[120px]  h-[50px]
              text-base rounded-2xl max-sm:w-[90px] max-sm:text-xs"
                onClick={() => {
                  navigate(Path.Home);
                  setFirstVisited(false);
                }}>
                아뇨, 괜찮습니다!
              </button>
            </div>
            <CircleProgressBar circle={{ index: 2, total: 3 }} />
          </div>
        </SwiperSlide>
      </Swiper>
    </SC.PopupBackGround>
  );
}
