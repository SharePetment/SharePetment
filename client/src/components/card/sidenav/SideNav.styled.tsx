import tw from 'tailwind-styled-components';

interface ContainerProp {
  direction: 'row' | 'col';
}

export const Container = tw.div<ContainerProp>`
  w-16
  flex
  ${props => `flex-${props.direction}`}
  ${props => props.direction === 'row' && 'w-72'}
  ${props => props.direction === 'col' && 'gap-3'}
  items-center
`;

export const Wrap = tw.div`
  flex-col
  justify-center
  items-center
  text-center
  mb-2
`;

export const Text = tw.span`
  text-xs
`;
