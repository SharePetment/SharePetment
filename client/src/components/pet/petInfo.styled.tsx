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
`;

export const Title = tw.h1`
font-semibold
text-2xl
mb-3
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
border-deepgray
justify-around
flex
py-3.5
px-5
max-sm:w-3/4
`;
