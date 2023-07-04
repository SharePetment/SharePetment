import { Btn } from './button.styled';

interface Prop {
  size: string; //lg, md, sm
  text: string;
  isgreen: string;
}

export default function Button({ size, text, isgreen }: Prop) {
  return (
    <Btn isgreen={isgreen} size={size}>
      {text}
    </Btn>
  );
}
