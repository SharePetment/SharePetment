import tw from 'tailwind-styled-components';

export const PopupBackGround = tw.div`
    fixed
    top-0
    right-0
    w-full
    h-full
    bg-popup
    flex
    justify-center 
    items-center
`;

export const PopupBox = tw.div`
    bg-[#D9D9D9]
    flex
    flex-col
    items-center
    justify-center 
    h-64
    z-10
    rounded-3xl
    px-2.5
    max-sm:w-3/4
    w-1/3
`;

export const Title = tw.h1`
    text-xl
    font-semibold
    text-center
    mb-8
    max-sm:w-3/4
`;

export const ButtonBox = tw.div`
    flex
    w-full
    justify-around
`;
