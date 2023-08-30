import tw from 'tailwind-styled-components';

export const NavContainer = tw.nav`
  hidden
  max-sm:block
  bg-white
  fixed
  bottom-[16px]
  rounded-[30px]
  left-1/2
  translate-x-[50%]
  z-[800]
  shadow-xl
`;

export const HostList = tw.ul`
  flex
  gap-8
  py-3
  px-10
  max-sm:px-7
  max-sm:gap-7
`;

export const GuestList = tw.ul`
  flex
  gap-8
  py-3
  px-10
`;
