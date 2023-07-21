import tw from 'tailwind-styled-components';

export const Container = tw.div`
  w-screen
  h-screen
  bg-defaultbg
  flex
  flex-col
  justify-center
  items-center
  gap-8
  py-5
`;

export const ErrorText = tw.h5`
  font-extrabold
  text-sm
  text-center
  text-defaulttext
`;

export const ErrorMessage = tw.h5`
  mt-2
  text-sm
  text-center
  text-deepgray
`;

export const HomeBtn = tw.button`
  w-[350px]
  max-sm:w-80
  bg-deepgreen
  rounded-xl
  py-3
  hover:scale-[1.03]
  hover:shadow
  transition-transform	
  duration-300
  text-base
  font-extrabold
  text-white
  mb-5
`;
