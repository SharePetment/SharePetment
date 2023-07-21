import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import tw from 'tailwind-styled-components';
import { BooleanStr } from '../../types/propType.ts';

type ErrorMessage = {
  error?:
    | string
    | FieldError
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
  duplicated?: BooleanStr;
};

export const FormContainer = tw.div`
  mt-4
  pb-10
`;

export const InputContainer = tw.div`
  w-80
  relative
  w-[320px] max-sm:w-[220px]
  max-sm:flex
  max-sm:flex-col
  max-sm:text-sm
`;

export const Label = tw.label`
  block
  font-bold
  text-defaulttext
  mb-1
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

export const ErrorNotice = tw.p<{ messagetext?: string }>`
  text-[#FF7B7B]
  absolute
  top-0
  right-0
  ${prop => prop.messagetext === '사용가능한 아이디입니다.' && `text-deepgreen`}
  max-sm:text-xs
  max-sm:top-[-10px]
  max-sm:text-end
  max-sm:max-w-[92px]
`;
