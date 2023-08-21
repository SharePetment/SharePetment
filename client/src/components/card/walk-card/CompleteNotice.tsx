import { ReactComponent as Paw } from '@/assets/button/like.svg';
import {
  Backdrop,
  CompleteNotice,
  CompleteText,
} from '@/components/card/walk-card/walkCard.styled';

type Prop = {
  size: 'lg' | 'sm';
};

export default function CompleteBox({ size }: Prop) {
  return (
    <Backdrop size={size}>
      <CompleteNotice className="flex items-center">
        <Paw className="shrink-0" fill="white" />
        <CompleteText>모집 완료</CompleteText>
      </CompleteNotice>
    </Backdrop>
  );
}
