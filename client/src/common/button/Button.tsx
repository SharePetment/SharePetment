import * as SC from '@/common/button/button.styled';
import { BooleanStr, Size, Handler } from '@/types/propType.ts';

interface Prop {
  size: Size; //lg, md, sm
  text: string;
  isgreen: BooleanStr;
  handler?: Handler;
  disabled?: boolean;
}

export default function Button({
  size,
  text,
  isgreen,
  handler,
  disabled,
}: Prop) {
  const voidFn = () => {
    // 빈함수
  };
  return (
    <SC.Btn
      isgreen={isgreen}
      size={size}
      onClick={handler ? handler : voidFn}
      disabled={disabled === undefined ? false : disabled ? true : false}>
      {text}
    </SC.Btn>
  );
}
