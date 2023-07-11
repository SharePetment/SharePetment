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
gap-6
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
export const ListBox = tw.div``;
