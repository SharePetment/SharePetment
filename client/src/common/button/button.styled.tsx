import tw from 'tailwind-styled-components';
import { BooleanStr, Size } from '../../types/propType.ts';

interface BtnProp {
  isgreen: BooleanStr;
  size: Size;
}

export const Btn = tw.button<BtnProp>`
  ${prop => (prop.isgreen === 'true' ? `bg-deepgreen` : 'bg-white')}
  ${prop => (prop.isgreen === 'true' ? `text-white` : 'text-deepgreen')}
  ${prop => prop.size === 'lg' && 'w-[320px] max-sm:w-[220px]'}
  ${prop => prop.size === 'md' && 'w-[200px] max-sm:w-[120px]'}
  ${prop => prop.size === 'sm' && 'w-[120px] max-sm:w-[80px]'}
  h-[50px]
  text-base
  rounded-2xl
`;
