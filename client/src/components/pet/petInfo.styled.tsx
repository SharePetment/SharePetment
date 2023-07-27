import tw from 'tailwind-styled-components';

export const Container = tw.div`
    flex
    flex-col
    justify-center
    items-center
    w-100
    py-5
    px-10
    h-90
    bg-white
    rounded-2xl
    max-sm:w-3/4
    relative
`;

export const Form = tw.form`
mt-2
w-2/3
flex
flex-col
items-center
gap-4
`;

export const RadioBox = tw.div`
border
rounded-[10px]
border
justify-around
flex
py-3.5
px-5
rounded-[10px]
w-[320px] 
max-sm:w-[220px]
`;
