import tw from 'tailwind-styled-components';
import { ReactComponent as Check } from '../../../assets/button/pet-check.svg';
import { ReactComponent as Setting } from '../../../assets/button/setting.svg';

export const Container = tw.div`
    relative
`;

interface Prop {
  check: 'true' | 'false';
}
export const PetCheck = tw(Check)<Prop>`
    ${prop => (prop.check === 'true' ? `fill-deepgreen` : `fill-black`)}
    w-[40px]
    h-[40px]
    absolute
`;

export const SettingPet = tw(Setting)`
absolute
`;
