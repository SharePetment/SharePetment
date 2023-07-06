import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import tw from 'tailwind-styled-components';

type ErrorMessage = {
  error?:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
};

export const InputContainer = tw.div`
  w-80
  relative
`;

export const Label = tw.label`
  block
  font-extrabold
  text-defaulttext
`;

export const InputText = tw.input<ErrorMessage>`
  w-full
  py-3.5
  px-5
  border
  rounded-[10px]

  ${prop => prop.error === undefined && `border-deepgray`}
  ${prop => typeof prop.error === 'string' && `border-[#FF7B7B]`}
`;

export const ErrorNotice = tw.p`
  text-[#FF7B7B]
  absolute
  top-0
  right-0
`;
