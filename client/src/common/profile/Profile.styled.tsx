import tw from 'tailwind-styled-components';

interface ProfileContainerProps {
  size: string;
  isgreen: string;
}

export const ProfileImage = tw.img<ProfileContainerProps>`
   ${prop => prop.size === 'lg' && `w-[135px] h-[135px]`}
   ${prop => prop.size === 'md' && `w-[52px] h-[52px]`}
   ${prop => prop.size === 'sm' && `w-[32px] h-[32px]`}
   ${prop =>
     prop.isgreen === 'true'
       ? `border-2 border-deepgreen`
       : `border border-lightgray`}
    rounded-full
    object-cover
`;
