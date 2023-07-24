import tw from 'tailwind-styled-components';

export const PopupBackGround = tw.div`
    fixed
    top-0
    right-0
    w-full
    h-full
    flex
    justify-center
    items-center
    z-[9999]
    bg-zinc-900/75
`;

export const PopupBox = tw.div`
    bg-[#D9D9D9]
    flex
    flex-col
    items-center
    justify-center 
    h-64
    z-300
    rounded-3xl
    px-2.5
    max-sm:w-5/6
    w-[500px]
    border
    absolute
    top-[50%]
    left-[50%]
    transform -translate-x-1/2 -translate-y-1/2
`;

export const Title = tw.h1`
    text-xl
    font-semibold
    text-center
    mb-8
    max-sm:w-100
    max-sm:text-lg
`;
interface Prop {
  countbtn: string;
}
export const ButtonBox = tw.div<Prop>`
    flex
    w-full
    ${prop => prop.countbtn === `1` && `justify-center`}
    ${prop => prop.countbtn === `2` && `justify-around`}
`;
