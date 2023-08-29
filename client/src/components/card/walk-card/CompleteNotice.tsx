import { ReactComponent as Paw } from '@/assets/button/like.svg';
import * as SC from '@/components/card/walk-card/walkCard.styled';

type Prop = {
  size: 'lg' | 'sm';
};

export default function CompleteBox({ size }: Prop) {
  return (
    <SC.Backdrop size={size}>
      <SC.CompleteNotice className="flex items-center">
        <Paw className="shrink-0" fill="white" />
        <SC.CompleteText>모집 완료</SC.CompleteText>
      </SC.CompleteNotice>
    </SC.Backdrop>
  );
}
