import tw from 'tailwind-styled-components';

export const Container = tw.footer`
  flex
  flex-col
  items-center
  gap-2
  bg-defaultbg
  mt-10
`;

export const TopContainer = tw.div`
  h-[20px]
  flex
  gap-2
  items-center
`;

export const Text = tw.address`
  text-xs
  font-semibold
  text-[lightgray]
`;
