import tw from 'tailwind-styled-components';

export const Container = tw.div`
  bg-defaultbg
  w-screen
  h-[670px]
  flex
  justify-center
  items-center
  mt-10
  max-sm:mt-8
`;

export const FollowContainer = tw.div`
  w-screen
  h-[650px]
  flex
  flex-col
  justify-center
  items-center
  py-5
`;

export const Img = tw.img`
  w-[23rem]
  mb-10
`;

export const Text = tw.span`
  text-base
  font-black
  text-center
`;

export const Button = tw.button`
  mt-8
  w-[200px]
  max-sm:w-80
  rounded-xl
  text-base
  text-white
  font-black
  bg-deepgreen
  py-3
  flex
  justify-center
  gap-2
  items-center
  hover:scale-[1.03]
  hover:shadow
  transition-transform	
  duration-300
`;
