import tw from 'tailwind-styled-components';

export const Container = tw.div`
  w-full
  relative
`;

export const Input = tw.input`
  border-[1.5px]
  border-lightgray
  resize-none
  w-full
  h-10
  max-sm:h-9
  rounded-[10px]
  p-3
  text-xs
  pr-10
`;

export const CommentBtn = tw.button`
  absolute
  bottom-[0.4rem]
  right-2
  max-sm:bottom-[0.3rem]
`;
