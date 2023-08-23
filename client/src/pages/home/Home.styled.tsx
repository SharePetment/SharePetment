import tw from 'tailwind-styled-components';

export const TopBtn = tw.button`
  fixed
  bottom-6
  right-6
  text-3xl
  bg-deepgreen
  rounded-full
  w-14
  h-14
  text-white
  drop-shadow-lg
  hover:bg-white
  hover:text-deepgreen
  hover:border
  transition-all
  duration-300
  animate-fadeInUp
`;
