import tw from 'tailwind-styled-components';
export const PetProfileDiv = tw.div`
    w-3/4
    mb-3
`;

export const ProfileHeader = tw.div`
    flex
    items-center
    justify-center
`;

export const ProfileText = tw.div`
    ml-2
    w-3/5
    text-bases
    font-semibold
    max-sm:w-5/6
    max-sm:text-sm
`;

export const ProfileTail = tw.div`
mt-3
flex
items-center
justify-center

`;

export const Label = tw.label`
    bg-deepgreen
    px-10
    py-3
    w-[300px]
    text-center
    text-white
    rounded-2xl
    cursor-pointer
    max-sm:w-[220px]
    max-sm:text-sm
`;

export const CropDiv = tw.div`
fixed
top-0
right-0
w-full
h-full
flex
flex-col
justify-center 
items-center
z-50
bg-zinc-900
`;

export const ButtonBox = tw.div`
    mt-6
    flex
    gap-4
`;
