import tw from 'tailwind-styled-components';
import { BooleanStr } from '../../types/propType';

export const InfoForm = tw.form`
  flex
  flex-col
  items-center
  gap-7
`;

export const ConfirmButton = tw.button<{ isduplicated: BooleanStr }>`
  px-4
  py-3
  bg-deepgreen
  text-white
  text-sm
  rounded-2xl
  absolute
  top-[33px]
  right-[6px]
  ${prop =>
    prop.isduplicated === 'false' && `hover:bg-white hover:text-deepgreen`}
  ${prop => prop.isduplicated === 'true' && `bg-lightgray cursor-default`}
`;

export const ExtraInfoLogo = tw.div`
  ml-8 
  mt-3 
  max-sm:w-80 
  max-sm:mx-auto 
  max-sm:justify-center 
  flex 
  items-center 
`;
