import tw from 'tailwind-styled-components';
import { BooleanStr } from '../../types/propType.ts';

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
  max-sm:hidden
  sticky
  top-0
`;

export const NavList = tw.ul`
  flex gap-5
  items-center
`;

export const NavItem = tw.li<{ active: BooleanStr }>`
  font-bold
  cursor-pointer
  ${prop => (prop.active === 'true' ? `text-deepgray` : `text-deepgreen`)}
`;
