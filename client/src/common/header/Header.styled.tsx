import tw from 'tailwind-styled-components';

export const HeaderContainer = tw.div`
  w-full
  flex
  justify-between
  items-center
  px-6
  py-4
`;

export const NavList = tw.ul`
  flex gap-5
  items-center
`;

export const NavItem = tw.li<{ currenttab: number; idx: number }>`
  font-bold
  cursor-pointer
  ${prop => (prop.currenttab === prop.idx ? `text-deepgreen` : `text-deepgray`)}
`;
