import tw from 'tailwind-styled-components';

export const Container = tw.div`
  w-full
  relative
`;

export const Input = tw.textarea`
  border-[1.5px]
  border-lightgray
  resize-none
  w-full
  h-10
  rounded-[10px]
  px-3
  text-xs
  py-3
  pr-10
`;

export const CommentBtn = tw.button`
  absolute
  bottom-3
  right-2
`;
