import tw from 'tailwind-styled-components';
import { BooleanStr } from '@/types/propType';

export const NavItemContainer = tw.li<{ active: BooleanStr }>`
  font-bold
  cursor-pointer
  ${prop => (prop.active === 'true' ? `text-deepgray` : `text-deepgreen`)}
`;
