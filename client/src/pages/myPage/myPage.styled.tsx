import tw from 'tailwind-styled-components';

export const Container = tw.main`
flex
flex-col
justify-center
items-center
mt-10
max-sm:mt-8
bg-defaultbg
w-screen
mb-20
`;

// User Box
export const UserBox = tw.div`
flex
flex-col
items-center
justify-center
gap-2
`;

export const UserNameBox = tw.div`
flex 
items-center 
gap-4

`;

export const UserName = tw.span`
  text-[20px]
`;

export const UserInfoBox = tw.div`
  flex
  gap-4
  mb-4
`;

export const HightliteText = tw.span`
  font-semibold
`;

// pet Box
export const PetBox = tw.div`
  flex
  flex-col
  items-center
  justify-center
  gap-2
`;

// list Box
export const ListBox = tw.div`
`;

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
