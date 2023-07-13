import tw from 'tailwind-styled-components';

export const CardContainer = tw.div<{ size: string }>`
  ${prop => prop.size === 'sm' && `w-56 gap-3`}
  ${prop => prop.size === 'lg' && `w-60 h-72 gap-4`}
  rounded-[28px]
  border-2
  px-4
  py-6
  border-lightgray
  flex
  flex-col
  relative

  transition 
  duration-300 
  ease-in-out

  hover:shadow-lg
  dark:hover:shadow-black/30"
`;

export const WalkDate = tw.div`
  text-deepgray
`;

export const Title = tw.div`
  font-semibold
  text-lg
`;

export const WalkMateList = tw.ul`
  flex
  flex-col
  gap-1.5
`;

export const WalkMateItem = tw.li`
  flex
  gap-2
`;

export const LocationTitle = tw.span`
  block
  whitespace-nowrap
  overflow-hidden
  text-ellipsis
`;

export const WriterProfile = tw.div`
  flex
  gap-2
  items-center
  mt-5
`;

export const Backdrop = tw.div<{ size: string }>`
  ${prop => prop.size === 'sm' && `w-[224px] h-[262px]`}
  ${prop => prop.size === 'lg' && `w-60 h-72`}
  rounded-[28px]
  bg-defaulttext
  opacity-70
  absolute
  -top-0.5
  -left-0.5
`;

export const CompleteText = tw.div`
  ml-3
  font-bold
  shrink-0
`;

export const CompleteNotice = tw.div`
  text-3xl
  text-white
  absolute
  top-1/2
  left-1/2
  -translate-x-[72%]
  -translate-y-[50%]
`;
