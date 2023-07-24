import tw from 'tailwind-styled-components';

export const Container = tw.div`
  w-screen
  h-screen
  bg-defaultbg
  flex
  flex-col
  items-center
  py-12
`;

export const LoginBtn = tw.button`
  mt-8
  w-[350px]
  max-sm:w-80
  rounded-xl
  text-base
  font-black
  bg-[#FEE102]
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

export const LoginText = tw.span`
  text-base
  font-extrabold
`;

export const GuestText = tw.span`
  mt-3
  mb-10
  text-sm
  text-lightgray
  cursor-pointer
  font-medium
`;
