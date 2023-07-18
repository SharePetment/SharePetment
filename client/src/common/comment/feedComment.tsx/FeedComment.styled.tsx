import tw from 'tailwind-styled-components';
export const Container = tw.div`
  flex
  flex-col
`;

export const UserBox = tw.div`
  flex
  items-center
  gap-2
`;

export const UserId = tw.span`
  font-black
  text-defaulttext
  text-xs
  cursor-pointer
`;

export const Time = tw.span`
  text-deepgray
  text-xs
  cursor-default
`;

export const Content = tw.span`
  pl-10
  text-xs
  leading-[1.2rem]
`;

export const EditText = tw.span`
  text-deepgray
  text-xs
  cursor-pointer
`;

export const EditInput = tw.input`
  border-[1.5px]
  border-lightgray
  resize-none
  w-[17rem]
  h-8
  ml-10
  text-xs
  p-2
  rounded-[10px]
  pr-9
`;

export const EditBtn = tw.button`
  absolute
  right-4
  bottom-[0.1rem]
`;
