import { ReactComponent as Star } from '@/assets/button/star.svg';
import * as SC from '@/components/toast/Toast.styled.tsx';

export default function Toast() {
  return (
    <SC.Container className="animate-smoothAppear">
      <Star />
      <SC.Text>링크가 복사되었습니다.</SC.Text>
    </SC.Container>
  );
}
