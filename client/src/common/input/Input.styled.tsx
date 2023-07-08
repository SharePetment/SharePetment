import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import tw from 'tailwind-styled-components';

type ErrorMessage = {
  error?:
    | string
    | FieldError
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
};

export const FormContainer = tw.div`
  pt-20
  pb-10
`;

export const InputContainer = tw.div`
  w-80
  relative
  max-sm:flex
  max-sm:flex-col
  max-sm:items-center


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

  ${prop => prop.error === undefined && `border-lightgray`}
  ${prop => typeof prop.error === 'string' && `border-[#FF7B7B]`}


`;

export const ErrorNotice = tw.p`
  text-[#FF7B7B]
  absolute
  top-0
  right-0
`;
