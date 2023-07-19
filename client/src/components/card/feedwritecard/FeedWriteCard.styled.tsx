import tw from 'tailwind-styled-components';

export const Container = tw.div`
  w-96
  h-[600px]
  max-sm:w-[350px]
  max-sm:h-[540px]
  rounded-[28px]
  px-3
  pt-6
  border
  border-lightgray
  shadow-lg
  flex
  flex-col
  items-center
  relative
  gap-5
  bg-white
  z-100
`;

export const Wrap = tw.div`
  flex
  relative
  justify-center
`;

export const Title = tw.h3`
  text-lg
  font-extrabold
`;

export const Pluslabel = tw.label`
  bg-lightgray
  hover:bg-deepgray
  transition-colors
  duration-300
  cursor-pointer
`;

export const Form = tw.form`
  w-full
  h-full
  flex
  justify-center
  items-center
`;

export const Textarea = tw.textarea`
  w-80
  h-28
  rounded-lg
  text-xs
  p-2
  border
  border-lightgray
  relative
  resize-none
  max-sm:h-16
  max-sm:pr-9
`;

export const SubmitBtn = tw.button`
  absolute
  bottom-11
  right-10
  cursor-pointer
  z-10
  w-[28px]
  h-[28px]
  max-sm:right-5
  max-sm:bottom-7
`;
