import tw from 'tailwind-styled-components';
import { ReactComponent as Plus } from '../../assets/button/plus.svg';
export const ButtonContainer = tw.button`
    border-2
    bg-[#ffffff]
    p-1
    rounded-xl
    mb-3
`;
export const PlusIcon = tw(Plus)`
    fill-deepgreen
`;
