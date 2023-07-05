import { BooleanStr, BtnSize, Handler } from '../../types/buttonType';
import { Btn } from './button.styled';

interface Prop {
  size: BtnSize; //lg, md, sm
  text: string;
  isgreen: BooleanStr;
  handler: Handler;
}

export default function Button({ size, text, isgreen, handler }: Prop) {
  return (
    <Btn isgreen={isgreen} size={size} onClick={handler}>
      {text}
    </Btn>
  );
}
