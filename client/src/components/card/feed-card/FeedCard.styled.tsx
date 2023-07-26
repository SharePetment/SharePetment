import tw from 'tailwind-styled-components';

export const Container = tw.div`
  drop-shadow-2xl
`;

export const Feed = tw.img`
  w-96
  bg-slate-400
  rounded-[28px]
  bg-lightgray
  border-4
  border-deepgreen
`;

export const ContentContainer = tw.div`
  absolute
  bottom-10
  bg-zinc-900/30
  left-5
  p-3
  rounded-xl
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
