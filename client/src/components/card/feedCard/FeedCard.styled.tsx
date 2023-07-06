import tw from 'tailwind-styled-components';

export const Container = tw.div`
  shadow-lg
`;

export const Feed = tw.img`
  w-96
  h-[568px]
  bg-slate-400
  rounded-[28px]
  bg-lightgray
`;

export const ContentContainer = tw.div`
  absolute
  bottom-10
  left-7
  flex
  flex-col
  gap-2
  ease-in-out
`;

export const Wrap = tw.div`
  flex
  gap-x-2
  items-center
`;

export const UserName = tw.h3`
  text-xs
  font-semibold
  text-white
`;

interface ContextProp {
  ismore: 'true' | 'false';
}

export const Context = tw.span<ContextProp>`
  text-xs
  text-white
  ease-out
  animate-fadeInUp
  ${props => props.ismore === 'true' && 'w-80'}
`;

export const More = tw.span`
  text-xs
  text-white
  cursor-pointer
  font-semibold
`;
