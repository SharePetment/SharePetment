import tw from 'tailwind-styled-components';

export const GridContainerFeed = tw.div`
  grid
  grid-cols-[180px_180px_180px]
  max-sm:grid-cols-[160px_160px]
  gap-1
`;

export const GridContainerWalk = tw.div`
  grid
  gap-y-4
  grid-cols-[240px_240px_240px]
  max-sm:grid-cols-[240px_240px]
  max-[500px]:grid-cols-[240px]
  justify-items-center	
`;

export const CommentList = tw.li`
  flex 
  justify-between 
  items-center 
  gap-1 
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
