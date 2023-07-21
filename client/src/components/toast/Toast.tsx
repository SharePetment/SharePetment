import { ReactComponent as Star } from '../../assets/button/star.svg';
import { Container, Text } from './Toast.styled.tsx';

export default function Toast() {
  return (
    <Container className="animate-smoothAppear">
      <Star />
      <Text>링크가 복사되었습니다.</Text>
    </Container>
  );
}
