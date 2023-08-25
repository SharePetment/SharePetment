import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import tw from 'tailwind-styled-components';
import { BooleanStr } from '@/types/propType.ts';

type ErrorMessage = {
  error?:
    | string
    | FieldError
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
  duplicated?: BooleanStr;
};

export const InfoForm = tw.form`
  flex
  flex-col
  items-center
  gap-7
`;

export const InputText = tw.input<ErrorMessage>`
  w-full
  max-sm:w-3/4
  py-3.5
  px-5
  border
  rounded-[10px]
  w-[320px] max-sm:w-[220px]
  ${prop => prop.error === undefined && `border-lightgray`}
  ${prop => typeof prop.error === 'string' && `border-[#FF7B7B]`}
  ${prop => prop.duplicated === 'true' && `border-[#38ae8f]`}
  ${prop => prop.error === '사용가능한 아이디입니다.' && `border-deepgreen`}
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

export const QuitContainer = tw.div`
  flex
  flex-col
  items-center
  gap-1
  mt-3
`;

export const QuitTitle = tw.span`
  text-xs
`;

export const QuitForm = tw.form`
  flex
  gap-1
`;

export const QuitInput = tw.form`
  w-full
  bg-lightgray
  p-1
  text-xs
  rounded-md
`;

export const QuitBtn = tw.span`
  p-1
  text-xs
  bg-deepgreen
  flex-shrink-0
  rounded-md
  text-defaultbg
`;

export const QuitMessage = tw.p`
  text-xs
  text-rose-500
`;
