import tw from 'tailwind-styled-components';

export const HeaderContainer = tw.div`
  w-full
  flex
  justify-between
  items-center
  px-6
  py-4
  z-10
  bg-defaultbg
  border-lightgray
  shadow-md
`;

export const NavList = tw.ul`
  flex gap-5
  items-center
`;

export const NavItem = tw.li<{ active: boolean }>`
  font-bold
  cursor-pointer
  ${prop => (prop.active ? `text-deepgreen` : `text-deepgray`)}
`;
