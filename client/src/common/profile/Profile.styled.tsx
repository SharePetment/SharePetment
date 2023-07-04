import tw from 'tailwind-styled-components';
import { ProfileProps } from './Profile';

export const ProfileContainer = tw.div<ProfileProps>`
  ${prop => prop.size === 'lg' && `w-[135px] h-[135px]`}
  ${prop => prop.size === 'md' && `w-[52px] h-[52px]`}
  ${prop => prop.size === 'sm' && `w-[32px] h-[32px]`}
  bg-[url(${prop => prop.url})]
  border
  rounded-full
  ${prop =>
    prop.isgreened === 'true' ? `border-[green]` : `border-[lightgray]`}
`;
