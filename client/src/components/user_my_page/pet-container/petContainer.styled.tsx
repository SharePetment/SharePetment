import tw from 'tailwind-styled-components';
import { ReactComponent as Delete } from '../../../assets/button/delete.svg';
import { ReactComponent as CheckFalse } from '../../../assets/button/pet-check-false.svg';
import { ReactComponent as CheckTrue } from '../../../assets/button/pet-check-true.svg';
import { ReactComponent as Setting } from '../../../assets/button/setting.svg';

export const Container = tw.div`
    relative
    ml-10
    drop-shadow-sm
`;

export const PetCheckTrue = tw(CheckTrue)`
    w-[25px]
    h-[25px]
    absolute
    top-[15px]
    left-[-45px]
    cursor-pointer
`;

export const PetCheckFalse = tw(CheckFalse)`
    w-[25px]
    h-[25px]
    absolute
    top-[15px]
    left-[-45px]
    cursor-pointer
`;

export const SettingPet = tw(Setting)`
absolute
top-[18px]
right-[20px]
cursor-pointer
`;

export const DeletePet = tw(Delete)`
absolute
top-[18px]
right-[50px]
cursor-pointer
`;
