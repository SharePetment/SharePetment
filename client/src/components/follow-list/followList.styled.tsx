import tw from 'tailwind-styled-components';

export const FollowListContainer = tw.div`    
bg-[#D9D9D9]
flex
flex-col
items-center
justify-center 
h-64
z-300
rounded-3xl
px-2.5
max-sm:w-3/4
w-1/3
h-2/3
border
`;

export const Title = tw.span`
    font-semibold
    text-xl
    my-4
`;

export const FollowBox = tw.div`
    w-full
    h-5/6
    overflow-y-auto
    flex
    flex-col
    p-4
`;

export const FollowingBox = tw.div`
    flex
    hover:bg-lightgreen
`;

export const UserName = tw.span`
    text-xl
    font-base
    ml-8
`;
