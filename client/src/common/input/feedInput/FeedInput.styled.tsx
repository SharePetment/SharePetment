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
  p-3
  text-xs
  pr-10
`;

export const CommentBtn = tw.button`
  absolute
  bottom-3
  right-2
`;
