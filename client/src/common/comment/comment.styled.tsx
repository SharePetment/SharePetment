import tw from 'tailwind-styled-components';

export const Container = tw.div`
    flex
    items-center
    m-4
    relative
`;
export const HeaderBox = tw.div`
    flex

    items-center
`;
export const UserBox = tw.div`
    flex
    cursor-pointer
    items-center
`;
export const UserName = tw.span`
    mx-2
    text-sm
    font-semibold
`;
export const DateText = tw.span`
    text-lightgray
    text-sm
`;
export const ContentBox = tw.div`
    py-3
    px-5
`;

export const Content = tw.span`

py-2
`;

export const BtnBox = tw.div`
    flex
    justify-between
    w-[70px]
    ml-2
`;
export const EditBtn = tw.span`
    cursor-pointer
    text-lightgray
    text-sm
    hover:text-lightgreen
`;
export const DeleteBtn = tw.span`
    cursor-pointer
    text-lightgray
    text-sm
    hover:text-lightgreen
`;

export const Form = tw.form`
    relative
`;

export const Input = tw.input`
    py-1
    px-4
    w-[230px]
    rounded-2xl

    border-lightgray
    border-2
    outline-none
`;

export const WriteBtn = tw.button`
    absolute
    top-[7px]
    right-[9px]
`;
