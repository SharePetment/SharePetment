import tw from 'tailwind-styled-components';

export const TabMenu = tw.ul`
  flex
  items-center
  justify-around
  border-t
  border-t-lightgray 
  w-[300px] 
  mx-auto
  mb-14
  mt-8
`;

export const TabMenuList = tw.li`
  pt-3
  pl-3
  pr-3
  mt-[-1px]
  cursor-pointer
`;
