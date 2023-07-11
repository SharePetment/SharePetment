import tw from 'tailwind-styled-components';

export const GridContainer = tw.div`
  pt-10
  grid
  gap-5
  justify-center
  grid-cols-4
  max-xl:grid-cols-3
  max-[1027px]:grid-cols-2
  max-md:grid-cols-1
  justify-items-center
`;
