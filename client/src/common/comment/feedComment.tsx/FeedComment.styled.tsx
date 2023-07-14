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
  mr-1
`;

export const Time = tw.span`
  text-deepgray
  text-xs
`;

export const Content = tw.span`
  pl-10
  text-xs
  leading-[1.2rem]
`;
