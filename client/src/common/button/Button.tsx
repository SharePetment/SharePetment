import { BooleanStr, Size, Handler } from '../../types/propType';
import { Btn } from './button.styled';

interface Prop {
  size: Size; //lg, md, sm
  text: string;
  isgreen: BooleanStr;
  handler?: Handler;
}

export default function Button({ size, text, isgreen, handler }: Prop) {
  const voidFn = () => {
    // 빈함수
  };
  return (
    <Btn isgreen={isgreen} size={size} onClick={handler ? handler : voidFn}>
      {text}
    </Btn>
  );
}
