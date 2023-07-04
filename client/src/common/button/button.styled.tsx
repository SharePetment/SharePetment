import tw from 'tailwind-styled-components';

interface BtnProp {
  isgreen: string;
  size: string;
}

export const Btn = tw.button<BtnProp>`
${prop => (prop.isgreen === 'true' ? `bg-[green]` : 'bg-inherit')}
${prop => (prop.isgreen === 'true' ? `text-[white]` : 'text-[green]')}
${prop => prop.size === 'sm' && 'w-[320px]'}
${prop => prop.size === 'md' && 'w-[200px]'}
${prop => prop.size === 'lg' && 'w-[123px]'}
h-[50px]
text-base
rounded-2xl
`;
