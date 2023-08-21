import React from 'react';
import { Mousewheel, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import FeedCard from '@/components/card/feed-card/FeedCard.tsx';
import SideNav from '@/components/card/sidenav/SideNav.tsx';
import * as SC from '@/components/home-page/homeContainer/homeContainer.styled';
import ReButton from '@/components/home-page/re-btn/ReButton';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '@/common/carousel/carousel.css';
import { HomeProp } from '@/types/homeType';

export default function HomeCellphone({
  refValue,
  data,
  setIsGuestOpen,
  setIsToastOpen,
}: HomeProp) {
  return (
    <>
      <SC.HomeCellphoneContainer>
        <Swiper
          direction={'vertical'}
          slidesPerView={
            window.innerWidth < 500 ? (window.innerWidth < 400 ? 1 : 1.5) : 1.1
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
          {data &&
            data.pages.map((page, index) => (
              <React.Fragment key={index}>
                {page.map(img => (
                  <SwiperSlide
                    className="w-96 max-sm:w-full max-sm:h-full"
                    key={img.feedId}>
                    <div
                      className="flex justify-center items-center gap-5 max-sm:flex-col"
                      ref={refValue}>
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
        <ReButton data={data} />
      </SC.HomeCellphoneContainer>
    </>
  );
}
