import tw from 'tailwind-styled-components';

export const Container = tw.div`
  bg-defaultbg
  w-screen
  h-[670px]
  max-sm:h-[896px]
  flex
  flex-col
  justify-center
  items-center
  mt-10
  max-sm:mt-8
  relative
`;

export const ReBtn = tw.div`
  w-80
  h-9
  rounded-xl
  fixed
  z-50
  left-[50%]
  transform -translate-x-1/2
  hover:drop-shadow-md
  bg-deepgreen
  text-white
  transition-all
  flex
  justify-center
  items-center
`;
