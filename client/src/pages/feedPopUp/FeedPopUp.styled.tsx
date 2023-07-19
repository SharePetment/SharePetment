import tw from 'tailwind-styled-components';

export const Container = tw.div`
  fixed
  top-0
  right-0
  w-screen
  h-screen
  flex
  justify-center
  items-center
  z-40
  bg-zinc-900/75
  z-50
  relative
`;

export const CloseBtn = tw.button`
  absolute
  right-10
  top-10
`;

export const FeedContainer = tw.div`
  w-[48rem]
  h-[560px]
  bg-defaultbg
  flex
  p-2
  rounded-[2rem]
  drop-shadow-xl
  gap-2
`;

export const RightBox = tw.div`
  w-[22rem]
  p-3
  flex
  flex-col
  items-center
`;

export const CommentBox = tw.div`
  w-full
  h-[26rem]
  overflow-scroll
  flex
  flex-col
  gap-y-5
  max-sm:gap-y-2
  mb-3
  max-sm:mb-2
  py-3
  border-b-[1.5px]
  border-lightgray
  overflow-x-hidden
  overflow-y-auto
`;

export const FeedCardContainer = tw.div`
  fixed
  top-0
  right-0
  w-screen
  h-screen
  flex
  justify-center
  items-center
  z-40
  bg-zinc-900/75
  z-10
  relative
  flex-col
  gap-5
  pt-10
`;

export const CommentContainer = tw.div`
  fixed
  w-full
  h-full
  flex
  justify-center
  z-30
  pt-[4.6rem]
`;

export const CommentClose = tw.div`
  absolute
  right-10
  top-10
`;
