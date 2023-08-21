import tw from 'tailwind-styled-components';

export const Container = tw.div`
fixed
w-screen
h-screen
top-0
right-0
flex
justify-center
items-center
z-30
pt-10
max-sm:pt-0
bg-zinc-900/75
`;

export const Wrap = tw.div`
  bg-white
  w-[320px]
  h-[570px]
  rounded-3xl
  p-3
`;

export const CommentBox = tw.div`
  w-full
  h-[31rem]
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
