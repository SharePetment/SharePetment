import tw from 'tailwind-styled-components';

interface SelectProp {
  selectsize: string;
  direction: string;
}

export const SelectInput = tw.select<SelectProp>`
  h-[50px]
  outline
  outline-[#d9d9d9]  
  border-1
  rounded-2xl
  focus:outline
  cursor-pointer
  px-3
  appearance-none
  ${prop => prop.selectsize === 'lg' && 'w-[320px] max-sm:w-[220px]'}
  ${prop => prop.selectsize === 'md' && 'w-[200px] max-sm:w-[120px]'}
  ${prop => prop.selectsize === 'sm' && 'w-[120px] max-sm:w-[80px]'}
  ${prop => (prop.direction === 'row' ? 'mr-7' : 'mb-4')}
`;

interface SelectDivProp {
  direction: 'row' | 'column';
}

export const SelectContainer = tw.div<SelectDivProp>`
    flex
    ${prop => (prop.direction === 'row' ? 'flex-row' : 'flex-col')}
    justify-center
    items-center
`;
