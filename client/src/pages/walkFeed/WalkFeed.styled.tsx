import tw from 'tailwind-styled-components';
import { BooleanStr } from '../../types/propType.ts';

export const Divider = tw.div`
  w-full
  h-1
  border-b-[0.5px]
  border-lightgray
  mb-4
`;

export const WalkInfo = tw.div`
flex
gap-2
`;

export const CommentButton = tw.button`
  h-[50px]
  text-sm
  rounded-2xl
  bg-deepgreen
  flex-shrink-0
  w-20
  text-defaultbg
`;

export const GatherMate = tw.span<{ isopen: BooleanStr }>`
  shrink-0
  ${prop => (prop.isopen === 'true' ? 'text-yellow' : 'text-deepgray')}
  max-sm:text-xl
`;
