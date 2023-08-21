import React from 'react';
import FeedCard from '@/components/card/feed-card/FeedCard.tsx';
import SideNav from '@/components/card/sidenav/SideNav.tsx';
import * as SC from '@/components/home-page/homeContainer/homeContainer.styled';
import ReButton from '@/components/home-page/re-btn/ReButton';
import '@/common/carousel/carousel.css';
import { HomeProp } from '@/types/homeType';

export default function HomeComputer({
  refValue,
  data,
  setIsGuestOpen,
  setIsToastOpen,
}: HomeProp) {
  return (
    <SC.HomeComputerContainer>
      {data &&
        data.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.map((img, idx) => (
              <div className="flex items-center gap-3" ref={refValue} key={idx}>
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
      <ReButton data={data} />
    </SC.HomeComputerContainer>
  );
}
