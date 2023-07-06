import tw from 'tailwind-styled-components';
import { BooleanStr } from '../../types/propType';

export const InputContainer = tw.div`
  w-80
  relative
`;

export const InputLabel = tw.label`
  absolute
  top-0
  block
  -top-6
  font-bold
`;

export const InputText = tw.input<{ isError: BooleanStr }>`
  w-full
  py-3.5
  px-5
  border
  rounded-[10px]
  ${prop => prop.isError === 'true' && `border-[#FF7B7B]`}
`;

export const ErrorNotice = tw.p`
  text-[#FF7B7B]
  absolute
  -top-4
  right-0
  text-xs
`;
