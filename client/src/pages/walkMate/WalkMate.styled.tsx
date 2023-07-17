import tw from 'tailwind-styled-components';

export const SearchButton = tw.button`
  w-20 
  max-sm:w-[200px]
  h-[50px]
  text-base
  rounded-2xl
  bg-deepgreen
  flex-shrink-0 
  text-defaultbg
`;

export const CommentList = tw.li`
  flex 
  justify-between 
  items-center 
  py-1 
  px-3 
  border 
  border-solid 
  border-lightgray 
  mb-1 
  rounded-md 
  hover:text-deepgreen 
  transition-colors
  duration-200 
  cursor-pointer
`;
