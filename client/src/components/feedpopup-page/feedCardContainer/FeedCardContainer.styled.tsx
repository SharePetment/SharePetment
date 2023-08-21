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
  z-10
  bg-zinc-900/30
  relative
  flex-col
  gap-5
  pt-10
`;

export const CloseBtn = tw.button`
  absolute
  right-10
  top-10
  z-0
`;
